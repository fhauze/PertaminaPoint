import api from "@/util/api";
export const getManga = () => {
    return api.get("/entertainment/manga");
};

export const getChapters = async(id) => {
    return await api.get(`/entertainment/manga/${id}/chapters`).then((res) => res.data);
};

export const getMangaByChapter = async(manga_id, chapter_id) => {
    return await api.get(`/entertainment/manga/${manga_id}/chapters/${chapter_id}/`).then((res) => res.data);
};

export const getMangaByChapterPages = async (manga_id, chapter_id) =>{
    return await api.get(`/entertainment/manga/${manga_id}/chapters/${chapter_id}/pages`).then((res) => res.data);
}