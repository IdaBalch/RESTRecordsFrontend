// const baseUrl = "https://localhost:7010/api/records";

const baseUrl = "https://restrecordsbackend-afathbgbf4h8ecay.germanywestcentral-01.azurewebsites.net/api/records";
const loginUrl = baseUrl.replace(/\/records$/, "/auth/login");

Vue.createApp({
    data() {
    return {
        records: [],
        searchType: "title",
        searchValue: "",
        message: "",

        newRecord: {
            title: "",
            artist: "",
            duration: 0,
            publicationYear: 0
        },

        recordMessage: "",

        auth: {
            username: "",
            password: ""
        },
        userInfo: null,
        authMessage: "",
        token: "",
        isLoggingIn: false
    };
},

    methods: {
        async login() {
            if (this.isLoggingIn) return;

            this.isLoggingIn = true;
            this.authMessage = "";
            const username = this.auth.username;

            try {
                const response = await axios.post(loginUrl, {
                    username: username,
                    password: this.auth.password
                });

                const token = response.data.token;
                if (typeof token !== "string" || !token) {
                    throw new Error("Login-svaret indeholder ikke et token.");
                }

                // Læs kun tokenets oplysninger til visning. API'et kontrollerer rettighederne.
                const payloadPart = token.split(".")[1];
                const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
                const bytes = Uint8Array.from(atob(base64), char => char.charCodeAt(0));
                const claims = JSON.parse(new TextDecoder().decode(bytes));

                this.token = token;
                this.userInfo = {
                    username: claims.sub || username,
                    role: claims.role
                        || claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
                        || ""
                };
                this.auth.password = "";
                await this.getRecords();
            }
            catch (error) {
                this.logout();
                this.auth.username = username;
                this.authMessage = error.response?.status === 401
                    ? "Forkert brugernavn eller adgangskode."
                    : "Kunne ikke logge ind. Prøv igen.";
            }
            finally {
                this.isLoggingIn = false;
            }
        },

        logout() {
            this.token = "";
            this.userInfo = null;
            this.auth.username = "";
            this.auth.password = "";
            this.authMessage = "";
            this.records = [];
            this.searchType = "title";
            this.searchValue = "";
            this.message = "";
        },

        async getRecords(params = {}) {
            if (!this.userInfo || !this.token) return;

            const requestToken = this.token;
            this.message = "Indlæser records...";

            try {
                const response = await axios.get(baseUrl, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${requestToken}`
                    }
                });

                // Ignorer gamle svar, hvis brugeren har logget ud imens.
                if (this.token !== requestToken) return;

                this.records = response.data;
                this.message = this.records.length + " records found.";
            }
            catch (error) {
                if (this.token !== requestToken) return;

                this.records = [];

                if (error.response?.status === 401) {
                    this.logout();
                    this.authMessage = "Dit login er udløbet eller ugyldigt. Log ind igen.";
                }
                else {
                    console.error("Fejl ved hentning:", error);
                    this.message = "Could not retrieve records.";
                }
            }
        },

        searchRecords() {
            const params = {};

            if (this.searchValue.trim() !== "") {
                params[this.searchType] = this.searchValue;
            }

            return this.getRecords(params);
        },

        resetSearch() {
            this.searchType = "title";
            this.searchValue = "";

            return this.getRecords();
        }, 
        async addRecord() {
    if (!this.token) return;

    this.recordMessage = "";

    try {
        const response = await axios.post(
            baseUrl,
            this.newRecord,
            {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        );

        console.log("Record created:", response.data);

        this.recordMessage = "Record successfully created!";

        // Clear form
        this.newRecord = {
            title: "",
            artist: "",
            duration: 0,
            publicationYear: 0
        };

        // Refresh records table
        await this.getRecords();

    }
    catch (error) {
        console.error("Error creating record:", error);

        this.recordMessage = "Could not create record.";
    }
},
    }
}).mount('#app');
