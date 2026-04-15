export default {
  namespaced: true,

  // DATA TEMPAT DISIMPAN
  state: () => ({
    items: []
  }),

  // CARA MENGUBAH STATE (HARUS SINKRON)
  mutations: {
    SET_ITEMS(state, payload) {
      state.items = payload;
    },
    ADD_ITEM(state, payload) {
      state.items.push(payload);
    }
  },

  // TEMPAT PANGGIL API / FUNGSI ASYNC
  actions: {
    fetchItems({ commit }) {
      // contoh data dari API
      const data = [
        { id: 1, name: "Apel" },
        { id: 2, name: "Mangga" }
      ];

      commit("SET_ITEMS", data); // <--- mutation dipanggil
    },

    createItem({ commit }, item) {
      commit("ADD_ITEM", item);
    }
  }
};
