

(function() {

    let membersDisplay;
    let membersList;    //array of JSON objects
    let democratTarget;
    let republicanTarget;
    let msg;
    let draggedSenator;

    window.onload = init;

    function init() {

        membersDisplay = document.getElementById("members");
        democratTarget= document.getElementById("democrats");
        republicanTarget = document.getElementById("republicans");
        msg = document.getElementById("msg");

        //Load xml data to membesrDisplay
        // initialize the JSON array

        //load the playlist xml file
        membersList = window.localStorage.getItem('senators');
        if (membersList) membersList = JSON.parse(membersList);
        if (membersList && membersList.length > 0) {
            renderSenators(membersList);
            renderVotes(membersList);
            let status = document.getElementById("msg");
            status.innerHTML = "From LocalStorage Loaded 10 senators";
        } else {
            makeRequest("partyList.xml").then(senators => {
                membersList = senators;
                renderSenators(membersList);
                window.localStorage.setItem('senators', JSON.stringify(membersList));
            })
        }

        // Add event handlers for the source
        membersDisplay.ondragstart = dragStartHandler;
        membersDisplay.ondragend = dragEndHandler;
        membersDisplay.ondrag = dragHandler;

        // Add event handlers for the democratTarget
        democratTarget.ondragenter = dragEnterHandler;
        democratTarget.ondragover = dragOverHandler;
        democratTarget.ondrop = dropHandler;

        // Add event handlers for the republicanTarget
        republicanTarget.ondragenter = dragEnterHandler;
        republicanTarget.ondragover = dragOverHandler;
        republicanTarget.ondrop = dropHandler;

    }

//---------------Drag object--------------
    function dragStartHandler(e) {
        e.dataTransfer.setData("Text", e.target.id);
        let sourceName = e.target.id;     // explicitly for some browsers
        draggedSenator = membersList.find(senator=>senator.name === sourceName);
        e.target.classList.add("dragged");
    }

    function dragEndHandler(e) {

        msg.innerHTML = "Drag ended";
        console.log(e);


        // //Append item into the target
        // let item = document.createElement("li");
        // item.innerHTML = e.target.innerText;
        // currentTarget.appendChild(item);

        let elems = document.querySelectorAll(".dragged");
        // for(let i = 0; i < elems.length; i++) {
        //     elems[i].classList.remove("dragged");
        // }
    }

    function dragHandler(e) {
        msg.innerHTML = "Dragging " + e.target.id;
    }


//----------------Drop to target Democrat-----------------
//     function dragEnterHandler(e) {
//         let currentTarget = e.currentTarget;
//
//         if(currentTarget.id === "democrats") {
//             if(draggedSenator.party === 'Democrat'){
//                 currentTarget.parentElement.classList = 'highlightedDemocrats';
//                 e.preventDefault();
//             }
//         } else if(currentTarget.id === "republicans") {
//             if(draggedSenator.party === 'Republican'){
//                 currentTarget.parentElement.classList = 'highlightedRepublicans';
//                 e.preventDefault();
//             }
//         }
//     }


    function dragEnterHandler(e) {
        let currentTarget = e.currentTarget;

        if(currentTarget.id === "democrats") {

            if(draggedSenator.party === 'Democrat'){
                currentTarget.classList = 'highlightedDemocrats';
                e.preventDefault();
            }
        } else if(currentTarget.id === "republicans") {

            if(draggedSenator.party === 'Republican'){
                currentTarget.classList = 'highlightedRepublicans';
                e.preventDefault();
            }
        }
    }

    function dragOverHandler(e) {
        let targetId = e.currentTarget.id;
        if(targetId === "democrats") {

            if(draggedSenator.party === 'Democrat'){

                e.preventDefault();
            }
        }
        if(targetId === "republicans") {
            if(draggedSenator.party === 'Republican'){

                e.preventDefault();
            }
        }

    }

    function dropHandler(e) {
        let targetId = this.id;
        this.classList.value = '';


        if (draggedSenator.voted === true) {
            e.preventDefault();
        }else{
            //draggedSenator.voted = "true";
            let partyTarget;
            if(targetId === "democrats") {

                if(draggedSenator.party === 'Democrat') {
                    draggedSenator.voted = true;
                    partyTarget = democratTarget;
                    //e.preventDefault(); //ADDED
                }
            } else if(targetId === "republicans") {
                if(draggedSenator.party === 'Republican') {
                    draggedSenator.voted = true;
                    partyTarget = republicanTarget;
                    //e.preventDefault(); //ADDED
                }
            }
            let item = document.createElement("li");
            item.innerHTML = draggedSenator.name;
            partyTarget.appendChild(item);
            window.localStorage.clear();
            window.localStorage.setItem("senators", JSON.stringify(membersList));
            e.preventDefault();

        }
    }

    //-----------------------------------------------------------//

    function makeRequest(url){
        return fetch(url).then(response => {
            return response.text();
        }).then (data => {
            let status = document.getElementById("msg");
            status.innerHTML = "From AJAX Loaded 10 senators";
            return loadXMLMembers(data);
        }).catch(e => {
            let status = document.getElementById("msg");
            status.innerHTML = "Error loading" + url;
        })
    };

    function loadXMLMembers(stringData) {

        xmlDoc = new DOMParser().parseFromString(stringData, "text/xml");
        // get all the song elements
        let allMenbers = xmlDoc.getElementsByTagName("senator");
        let senators = [];
        for (let i = 0; i < allMenbers.length; i++) {
            let name =
                allMenbers[i].getElementsByTagName("name")[0].textContent;
            let party =
                allMenbers[i].getElementsByTagName("party")[0].textContent;

            //Create member JSON object to push into arrayList, then add to localsStorage
            let newMember = {
                "name": name,
                "party": party,
                "voted": false,
                "id":name
            };
            senators.push(newMember);
        }
        return senators;
        //Load List of senators to the Local Storage
        //window.localStorage.setItem("senators", JSON.stringify(localStorageList));
    }

    function renderSenators(senators) {
        let membersDisplay = document.getElementById("members");
        senators.map(senator => {
            let item = document.createElement("li");
            item.innerHTML = senator.name;
            //if (!senator.voted) item.setAttribute('draggable', 'true');
            item.setAttribute('draggable', 'true');
            item.setAttribute("id", senator.name);
            membersDisplay.appendChild(item);
        });
    }

    function renderVotes(senators) {
        senators.map(senator=>{
            let partyTarget;
            if (senator.voted) {
                if (senator.party === 'Democrat') {
                    partyTarget = democratTarget;
                } else {
                    partyTarget = republicanTarget;
                }
                let item = document.createElement("li");
                item.innerHTML = senator.name;
                item.setAttribute('draggable', 'true');
                item.setAttribute("id", senator.name);
                partyTarget.appendChild(item);
            }
        })
    }

})();