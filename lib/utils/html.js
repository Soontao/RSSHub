const removeHTMLComments = ($) => {
    $('*').contents().each(function () {
        if (this.nodeType === 8) {
            $(this).remove();
        }
    });
};

const removeStyle = ($) => {
    $('*[style]').removeAttr('style');
    $('*').removeAttr('class');
    $('style').remove();
};

module.exports = {
    removeHTMLComments,
    removeComments: removeHTMLComments,
    removeStyle
};