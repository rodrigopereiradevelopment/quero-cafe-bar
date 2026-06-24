import { environment } from '@environment';

const ERROR_MESSAGES = {
    400: 'Dados invalidos. Verifique as informacoes e tente novamente.',
    401: 'Sua sessao expirou. Faca login novamente.',
    403: 'Voce nao tem permissao para realizar esta acao.',
    404: 'Registro nao encontrado.',
    409: 'Este registro ja existe. Verifique os dados e tente novamente.',
    500: 'Erro interno. Tente novamente em alguns instantes.',
};

function getErrorMessage(status, fallback) {
    return ERROR_MESSAGES[status] || fallback || `HTTP error! status: ${status}`;
}

class Api {
    constructor() {
        this.apiUrl = environment.apiUrl;
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(this.apiUrl.includes('ngrok') ? { 'ngrok-skip-browser-warning': 'true' } : {}),
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`, {
                ...options,
                headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                const router = document.querySelector('ion-router');
                if (router) {
                    router.push('/login', 'root');
                } else {
                    window.location.href = '/login';
                }
                throw new Error('Sessao expirada. Faca login novamente.');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || getErrorMessage(response.status));
            }

            if (response.status === 204) {
                return null;
            }

            return response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('A requisicao excedeu o tempo limite. Verifique sua conexao.');
            }
            throw error;
        }
    }

    // --- Autenticacao ---
    async login(usuario, senha) {
        const headers = {
            'Content-Type': 'application/json',
            ...(this.apiUrl.includes('ngrok') ? { 'ngrok-skip-browser-warning': 'true' } : {}),
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ usuario, senha }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.status === 401) {
                throw new Error('Usuario ou senha invalidos.');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || getErrorMessage(response.status));
            }

            const data = await response.json();

            if (!data || !data.access_token) {
                throw new Error('Resposta invalida do servidor. Token nao recebido.');
            }

            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('A requisicao excedeu o tempo limite. Verifique sua conexao.');
            }
            throw error;
        }
    }

    // --- Produtos ---
    async getProdutos(skip = 0, take = 20) {
        return this.request(`/produto?skip=${skip}&take=${take}`);
    }

    async addProduto(produtoData) {
        return this.request('/produto', {
            method: 'POST',
            body: JSON.stringify(produtoData),
        });
    }

    async getProdutoById(id) {
        return this.request(`/produto/${id}`);
    }

    async updateProduto(id, produtoData) {
        return this.request(`/produto/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(produtoData),
        });
    }

    async deleteProduto(id) {
        return this.request(`/produto/${id}`, {
            method: 'DELETE',
        });
    }

    async searchProdutoImage(query) {
        return this.request(`/produto/buscar-imagem?q=${encodeURIComponent(query)}`);
    }

    // --- Usuarios ---
    async getUsuarios(skip = 0, take = 20) {
        return this.request(`/usuario?skip=${skip}&take=${take}`);
    }

    async addUsuario(usuarioData) {
        return this.request('/usuario', {
            method: 'POST',
            body: JSON.stringify(usuarioData),
        });
    }

    async getUsuarioById(id) {
        return this.request(`/usuario/${id}`);
    }

    async updateUsuario(id, usuarioData) {
        return this.request(`/usuario/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(usuarioData),
        });
    }

    async deleteUsuario(id) {
        return this.request(`/usuario/${id}`, {
            method: 'DELETE',
        });
    }

    async changePassword(id, senhaAtual, novaSenha) {
        return this.request(`/usuario/${id}/change-password`, {
            method: 'PATCH',
            body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha }),
        });
    }

    // --- Mesas ---
    async getMesas(skip = 0, take = 20) {
        return this.request(`/mesa?skip=${skip}&take=${take}`);
    }

    async addMesa(mesaData) {
        return this.request('/mesa', {
            method: 'POST',
            body: JSON.stringify(mesaData),
        });
    }

    async getMesaById(id) {
        return this.request(`/mesa/${id}`);
    }

    async updateMesa(id, mesaData) {
        return this.request(`/mesa/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(mesaData),
        });
    }

    async deleteMesa(id) {
        return this.request(`/mesa/${id}`, {
            method: 'DELETE',
        });
    }

    // --- Comandas ---
    async getComandas(skip = 0, take = 20) {
        return this.request(`/comanda?skip=${skip}&take=${take}`);
    }

    async addComanda(comandaData) {
        return this.request('/comanda', {
            method: 'POST',
            body: JSON.stringify(comandaData),
        });
    }

    async getComandaById(id) {
        return this.request(`/comanda/${id}`);
    }

    async getComandaByMesaId(id_mesa) {
        return this.request(`/comanda/mesa/${id_mesa}`);
    }

    async updateComanda(id, comandaData) {
        return this.request(`/comanda/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(comandaData),
        });
    }

    async deleteComanda(id) {
        return this.request(`/comanda/${id}`, {
            method: 'DELETE',
        });
    }

    // --- Itens de Comanda ---
    async getItensComanda(id_comanda) {
        return this.request(`/comanda-item/${id_comanda}`);
    }

    async addItemComanda(itemData) {
        return this.request('/comanda-item', {
            method: 'POST',
            body: JSON.stringify(itemData),
        });
    }

    async updateItemComanda(id_comanda, id_produto, itemData) {
        return this.request(`/comanda-item/${id_comanda}/${id_produto}`, {
            method: 'PATCH',
            body: JSON.stringify(itemData),
        });
    }

    async deleteItemComanda(id_comanda, id_produto) {
        return this.request(`/comanda-item/${id_comanda}/${id_produto}`, {
            method: 'DELETE',
        });
    }
}

export const api = new Api();
