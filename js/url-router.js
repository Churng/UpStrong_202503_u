const urlPageTitle = "UpString"

document.addEventListener('click', (e) => {
    const { target } = e;

    if (!target.matches("nav a")){
        return;
    }

    e.preventDefault();

    urlRoute();
})

const urlRoutes = {
    "/": {
        template: "/html/Login.html",
        title: "",
        description: ""
    },
    "/login": {
        template: "/html/Login.html",
        title: "",
        description: ""
    },
    "/forget-password": {
        template: "/html/Forget.html",
        title: "",
        description: ""
    },
    "/signup": {
        template: "/html/Signup.html",
        title: "",
        description: ""
    },
};

const urlRoute = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href)
    urlLocationHandler();

};

const urlLocationHandler = async () => {
    const location = window.location.pathname;

    if(location.length = 0) {
        location = "/";
    }

    const route = urlRoutes[location];
    const html = await fetch(route.template).then((res) => res.text());
    document.getElementById("content").innerHTML = html;
};


window.onpopstate = urlLocationHandler;
window.route = urlRoute;

urlLocationHandler();