import api from "@/util/api";

export const getContent = () =>{
    return api.get('/content/contents')
}

export const getContentById =() =>{
    return api.get('content/contents/$id')
}

export const createContent = (data) => {
    return api.post('/content/contents',data)
}