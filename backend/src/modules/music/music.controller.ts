import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/public.decorator';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface PlaylistEntry {
  title: string;
  artist: string;
  filename: string;
}

function resolveAudioDir(): string {
  const candidates = [
    path.resolve(__dirname, '../../../../../frontend/public/assets/audio'),
    path.resolve(__dirname, '../../../../frontend/public/assets/audio'),
    path.resolve(process.cwd(), 'frontend/public/assets/audio'),
    path.resolve(process.cwd(), '../frontend/public/assets/audio'),
    path.resolve(__dirname, '../../frontend/public/assets/audio'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error(
    'Cannot find audio directory. Searched:\n' + candidates.join('\n'),
  );
}

const AUDIO_DIR = resolveAudioDir();
const MUSIC_DIR = path.join(AUDIO_DIR, 'music');
const PLAYLIST_PATH = path.join(AUDIO_DIR, 'playlist.json');

function sanitizeName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\.(mp3|opus|wav|ogg|flac)$/i, '')
    .trim();
}

function readPlaylist(): PlaylistEntry[] {
  try {
    return JSON.parse(
      fs.readFileSync(PLAYLIST_PATH, 'utf-8'),
    ) as PlaylistEntry[];
  } catch {
    return [];
  }
}

function writePlaylist(playlist: PlaylistEntry[]) {
  fs.writeFileSync(PLAYLIST_PATH, JSON.stringify(playlist, null, 2));
}

function scanFiles(): { filename: string; ext: string }[] {
  if (!fs.existsSync(MUSIC_DIR)) fs.mkdirSync(MUSIC_DIR, { recursive: true });
  const entries = fs.readdirSync(MUSIC_DIR);
  return entries
    .filter((f) => /\.(mp3|opus|wav|ogg|flac)$/i.test(f))
    .map((f) => ({ filename: f, ext: path.extname(f).toLowerCase() }));
}

function mergePlaylistWithFiles(
  playlist: PlaylistEntry[],
  files: { filename: string; ext: string }[],
): PlaylistEntry[] {
  const known = new Map(playlist.map((t) => [t.filename, t]));
  const result: PlaylistEntry[] = [];
  for (const file of files) {
    if (known.has(file.filename)) {
      result.push(known.get(file.filename)!);
    } else {
      result.push({
        title: sanitizeName(path.basename(file.filename, file.ext)),
        artist: 'Desconhecido',
        filename: file.filename,
      });
    }
  }
  return result;
}

@Public()
@Controller('music')
export class MusicController {
  @Get()
  list() {
    const playlist = readPlaylist();
    const files = scanFiles();
    return mergePlaylistWithFiles(playlist, files);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 30 * 1024 * 1024 } }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');
    if (!file.originalname.match(/\.(mp3|wav|flac|ogg)$/i)) {
      throw new BadRequestException(
        'Formato não suportado. Use MP3, WAV, FLAC ou OGG',
      );
    }

    const tempFile = path.join(
      MUSIC_DIR,
      `_temp_${Date.now()}_${file.originalname}`,
    );
    fs.writeFileSync(tempFile, file.buffer);

    const name = file.originalname.replace(/\.\w+$/, '');
    const opusFile = `${name}.opus`;
    const opusPath = path.join(MUSIC_DIR, opusFile);

    try {
      execSync(
        `ffmpeg -y -i "${tempFile}" -c:a libopus -b:a 48k "${opusPath}"`,
        { stdio: 'pipe', timeout: 60000 },
      );
    } catch {
      fs.unlinkSync(tempFile);
      throw new BadRequestException(
        'Erro ao converter o arquivo. Verifique se é um áudio válido.',
      );
    }

    fs.unlinkSync(tempFile);

    const playlist = readPlaylist();
    playlist.push({
      title: sanitizeName(name),
      artist: 'Desconhecido',
      filename: opusFile,
    });
    writePlaylist(playlist);

    return {
      message: 'Música convertida e adicionada com sucesso!',
      filename: opusFile,
      title: sanitizeName(name),
    };
  }

  @Delete(':filename')
  remove(@Param('filename') filename: string) {
    const filePath = path.join(MUSIC_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const playlist = readPlaylist();
    const filtered = playlist.filter((t) => t.filename !== filename);
    writePlaylist(filtered);

    return { message: 'Música removida com sucesso!' };
  }
}
