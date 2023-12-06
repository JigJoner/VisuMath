// main.js
import { ajaxGET, ajaxPOST } from "../../modules/ajax.js";

/*
    bubbleData
    primary: {
        type: "student",
        primary,
        username,
        firstName,
        lastName,
        email,
        password,
        posts: []
    }
    primary: {
        type: "userPost"
        primary 
        foreign (referencing the primary key in the user table)
        date: YYYY-MM-DD
        text (e.g., “Today, we learned how to connect Node.js to a MySQL database and return that data and display it into a web page.”)
        time: THH:mm:ss.sssZ
        views
    }
*/

export let func = {
    main: {
        doAll: async function () {
            this.loadForm();

            //Grab data from sessionStorage that was loaded previously
            let students = JSON.parse(sessionStorage.getItem("students"));
            let posts = JSON.parse(sessionStorage.getItem("posts"));
            if (!students) {
                students = await ajaxGET("/table-student", "json", ["type", "rows"]);
                sessionStorage.setItem("students", JSON.stringify(students));
            }
            if (!posts) {
                posts = await ajaxGET("/table-post", "json", ["type", "json"]);
                sessionStorage.setItem("posts", JSON.stringify(posts));
            }
            
            //Add student bubbles
            students.forEach(function (student) {
                func.main.addBubble({
                    id: student.ID,
                    type: "students",
                    header: `${student.userName}<br>${student.firstName} ${student.lastName}`
                }, student);
            })
            //Set event handlers for each bubble click
            let studentBubbles = document.querySelectorAll(".bubble");
            studentBubbles.forEach(function (bubble) {
                bubble.lastElementChild.addEventListener("click", function(e){
                    document.querySelector(".bubbleContainer").innerHTML = "";
                    posts.forEach(function(post){
                        if (post.userID == bubble.attributes.id.value){
                            func.main.addBubble({
                                id: post.ID,
                                type: "posts",
                                header: `${post.date}<br>${post.time}`,
                                description: `${post.text}`
                            })
                        }
                    })
                });
            })
            
        },
        addBubble: async function (bubbleData, original) {
            let bubbleTemplate = document.getElementById("bubbleTemplate");
            let bubbleDocFrag = bubbleTemplate.content.cloneNode(true);
            let bubbleNode = bubbleDocFrag.querySelector(".bubble");

            let bubbleHeader = bubbleDocFrag.querySelector(".bubbleHeader");
            let bubbleDetail = bubbleDocFrag.querySelector(".bubbleDetail");
            let bubbleDescription = bubbleDocFrag.querySelector(".bubbleDescription");
            let bubbleButton = bubbleDocFrag.querySelector(".bubbleButton");
            bubbleNode.id = `${bubbleData.id}`;
            bubbleHeader.innerHTML = `${bubbleData.header}`;
            bubbleButton.setAttribute("id", bubbleData.id);
            console.log(original);
            bubbleNode.style.left = original.hasOwnProperty("coord") ? original.coord.left : "0px";
            bubbleNode.style.top = original.hasOwnProperty("coord") ? original.coord.top : "0px";
            addDragFunction();

            function addDragFunction() {
                bubbleNode.addEventListener("mousedown", function (event) {
                    let shiftX = event.clientX - bubbleNode.getBoundingClientRect().left;
                    let shiftY = event.clientY - bubbleNode.getBoundingClientRect().top;
                    bubbleNode.style.position = 'absolute';
                    bubbleNode.style.zIndex = 1000;
                    moveAt(event.pageX, event.pageY);
                    document.addEventListener('mousemove', onMouseMove);
                    addStopFunctions();
                    function addStopFunctions() {
                        bubbleNode.addEventListener("mouseup", function (event) {
                            document.removeEventListener('mousemove', onMouseMove);
                            bubbleNode.onmouseup = null;
                            bubbleNode.style.zIndex = 1;
                            func.main.updateSession(bubbleData.type, bubbleData.id, ["coord", {
                                left: bubbleNode.style.left, 
                                top: bubbleNode.style.top
                            }])
                        })
                        document.addEventListener("mouseup", function (event) {
                            document.removeEventListener('mousemove', onMouseMove);
                            bubbleNode.onmouseup = null;
                            document.onmouseup = null;
                        })
                        document.addEventListener("mouseleave", function (event) {
                            document.removeEventListener('mousemove', onMouseMove);
                            bubbleNode.onmouseup = null;
                            document.onmouseleave = null;
                        })
                    }


                    function moveAt(pageX, pageY) {
                        if (bubbleNode.style.left.replace("px", "") >= -1 && bubbleNode.style.right.replace("px", "") >= -1) {
                            bubbleNode.style.left = pageX - shiftX + 'px';
                        }
                        if (bubbleNode.style.left.replace("px", "") < 0) {
                            bubbleNode.style.left = 0;
                        }
                        if (bubbleNode.style.right.replace("px", "") < 0) {
                            bubbleNode.style.right = 0;
                        }
                        if (bubbleNode.style.top.replace("px", "") >= 0 && bubbleNode.style.bottom.replace("px", "") >= 0) {
                            bubbleNode.style.top = pageY - shiftY + 'px';
                        }
                        if (bubbleNode.style.top.replace("px", "") < 0) {
                            bubbleNode.style.top = 0;
                        }
                        if (bubbleNode.style.bottom.replace("px", "") < 0) {
                            bubbleNode.style.bottom = 0;
                        }
                    }

                    function onMouseMove(event) {
                        moveAt(event.pageX, event.pageY);
                    }



                });
            }
            bubbleNode.ondragstart = function () {
                return false;
            };

            document.querySelector(".bubbleContainer").appendChild(bubbleDocFrag);
        },
        /**
         * 
         * @param {Object} students {primary: {...}}
         * @param {Object} posts {primary: {...}}
         */
        loadTable: async function (students, posts) {
            let postsArr = Object.entries(posts);
            postsArr.forEach(function ([key, val]) {
                students[val.foreign].posts.push([key, val]);
            })
            sessionStorage.setItem("assignment6", JSON.stringify(students));
        },
        loadForm: async function () {
            let username = document.getElementById("username");
            let password = document.getElementById("password");
            let text = document.getElementById("post");

        },
        updateSession(key, ID, pair){
            let students = JSON.parse(sessionStorage.getItem(key));
            students[ID - 1][pair[0]] = pair[1];
            sessionStorage.setItem(key, JSON.stringify(students));
        }

    },
    index: {
        doAll: async function () {
            document.getElementById("tempButton").addEventListener("click", function (e) {
                window.location.href = "/main";
            })
        },
    }
}
