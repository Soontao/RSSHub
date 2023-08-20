const removeHTMLComments = ($) => {
    if (typeof $ === 'function') {
        $('*').contents().each(function () {
            if (this.nodeType === 8) {
                $(this).remove();
            }
        });
    } else if (typeof $.find === 'function') {
        $.find('*').contents().each(function () {
            if (this.nodeType === 8) {
                $(this).remove();
            }
        });
    }
};

const removeStyle = ($) => {
    if (typeof $ === 'function') {
        $('*[style]').removeAttr('style');
        $('*').removeAttr('class');
        $('style').remove();
    } else if (typeof $.find === 'function') {
        $.find('*[style]').removeAttr('style');
        $.find('*').removeAttr('class');
        $.find('style').remove();
    }
};

const replaceNoScript = ($) => {
    $('noscript').each((_, noscriptNode) => {
        $(noscriptNode).replaceWith(noscriptNode.children);
    });
};

module.exports = {
    removeHTMLComments,
    removeComments: removeHTMLComments,
    removeStyle,
    replaceNoScript
};