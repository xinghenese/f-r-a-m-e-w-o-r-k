$.createPanel = function () {
};


var box2 = $.createPanel({
    id: "msgBox",
    className: "msgBox",
    div: [{
        id: "box_title",
        className: "box_title",
        text: "意见反馈"
    }, {
        id: "box_content",
        className: "box_content"
    }, {
        id: "btnSend",
        className: "btnSend",
        text: "发送"
    }, {
        id: "btnClose",
        className: "btnClose",
        text: "\u00D7"
    }]
});


var json = {
    parent: {
        child: {
            grandchild: 'grand'
        }
    }
};
var htmlifyJson = {
    div: {
        text: 'parent',
        div: {
            text: 'child',
            div: {
                text: 'grandchild: grand'
            }
        }
    }
};
var box = $.createPanel(htmlifyJson);









