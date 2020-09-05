const removeHTMLComments = ($) => {
    $('*').contents().each(function () {
        if (this.nodeType === 8) {
            $(this).remove();
        }
    });
};

module.exports = {
    removeHTMLComments
};