export const useApi = () => {
    const config = useRuntimeConfig()

    return $fetch.create({
        baseURL: config.public.apiBase,

        onRequest({ options }) {
            const token = process.client
                ? localStorage.getItem('access_token')
                : null

            if (token) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${token}`
                }
            }
        }
    })
}