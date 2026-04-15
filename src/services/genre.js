import api from "@/util/api";

export const getGenre = () => {
    return api.get("/entertainment/genres").then((res) => res.data);
};