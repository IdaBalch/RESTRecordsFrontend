Vue.createApp ( {
    data()
    {
        return {
            name: null, 
            message: "Virker det her?",
        }
    }, 
    methods: {
        sayHello(){
            this.message = "Hello " + this.name;
        }
    }
}).mount('#app'); 

