const { description } = require("../../package");

const sidebar = {
    guide: [
        {
            title: "Essentials",
            collapsable: false,
            children: ["", "/guide/installation", "/guide/setup"]
        },
        {
            title: "Tooling",
            collapsable: false,
            children: ["/guide/tools"]
        }
    ],
    team: [
        {
            title: "Team",
            collapsable: false
        }
    ],
    api: [
        {
            title: "Intro",
            collapsable: false,
            children: [""]
        },
        {
            title: "Users",
            collapsable: false,
            children: [
                "/api/create-user",
                "/api/update-user",
                "/api/delete-user",
                "/api/login-user"
            ]
        },
        {
            title: "Hubs",
            collapsable: false,
            children: ["/api/hubs/create", "/api/hubs/update", "/api/hubs/delete"]
        },
        {
            title: "Sensor",
            collapsable: false,
            children: ["/api/sensor/create", "/api/sensor/update", "/api/sensor/delete"]
        }
    ],
    examples: [
        {
            title: "Examples",
            collapsable: false,
            children: ["/examples/markdown"]
        }
    ]
};

module.exports = {
    title: "Data pixel dashboard",
    description: description,
    dest: "./lib/",
    head: [
        ["link", { rel: "icon", href: "./public/images/logo.png" }],
        ["meta", { name: "theme-color", content: "#3eaf7c" }],
        ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
        ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }]
    ],

    themeConfig: {
        repo: "",
        editLinks: false,
        editLinkText: "Edit this on GitHub!",
        lastUpdated: "Last updated",
        docsDir: "src",
        sidebarDepth: 2,
        sidebar: {
            collapsable: false,
            "/guide/": sidebar.guide,
            "/team/": sidebar.team,
            "/api/": sidebar.api,
            "/examples/": sidebar.examples
        },
        markdown: {
            lineNumbers: true,
            /** @param {import('markdown-it')} md */
            extendMarkdown: md => {
                md.options.highlight = require("./markdown/highlight")(md.options.highlight);
            }
        },
        nav: [
            {
                text: "Docs",
                ariaLabel: "Documentation Menu",
                items: [
                    {
                        text: "Guide",
                        link: "/guide/"
                    },
                    {
                        text: "Examples",
                        link: "/examples/markdown"
                    }
                ]
            },
            {
                text: "API Reference",
                link: "/api/"
            },
            {
                text: "Team",
                link: "/team/"
            }
        ]
    },
    plugins: ["@vuepress/back-to-top", "vuepress-plugin-smooth-scroll"]
};
