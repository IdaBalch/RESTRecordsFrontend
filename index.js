
const baseUrl = "https://localhost:7010/api/records";

Vue.createApp({
    data() {
        return {
            records: [],
            searchType: "title",
            searchValue: "",
            message: "Indlæser records..."
        }
    },

    methods: {
        async getRecords(params = {}) {
            try {
                const response = await axios.get(baseUrl, {
                    params: params
                });

                this.records = response.data;
                this.message = this.records.length + " records found.";
            }
            catch (error) {
                console.error("Fejl ved hentning:", error);
                this.message = "Could not retrieve records.";
            }
        },

        searchRecords() {
            const params = {};

            if (this.searchValue.trim() !== "") {
                params[this.searchType] = this.searchValue;
            }

            this.getRecords(params);
        },

        resetSearch() {
            this.searchType = "title";
            this.searchValue = "";

            this.getRecords();
        }
    },

    created() {
        this.getRecords();
    }

}).mount('#app');
