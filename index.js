
const baseUrl = "https://localhost:7010/api/records";

Vue.createApp({
    data() {
        return {
            records: [],
            message: "Indlæser records..."
        }
    },

    methods: {
        async getRecords() {
            try {
                const response = await axios.get(baseUrl);

                // Vis API-svaret i konsollen
                console.log("API response:", response);
                console.log("API data:", response.data);

                this.records = response.data;

                console.log("Records:", this.records);

                this.message = "Records hentet!";
            }
            catch (error) {
                console.error("Fejl ved hentning:", error);

                this.message = "Kunne ikke hente records.";
            }
        }
    },

    created() {
        this.getRecords();
    }

}).mount('#app');
