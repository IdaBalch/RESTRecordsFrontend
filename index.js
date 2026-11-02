Vue.createApp ( {
    data()
    {
        return {
            name: null, 
            message: "Hallooooo",
        }
    }, 
    methods: {
        sayHello(){
            this.message = "Hello " + this.name;
        }
    }
}).mount('#app'); 

