const got = require('@/utils/got');

function renderHtml(doc) {
    let html = '';

    for (let i = 0; i < doc.content?.length; i++) {
        const content = doc.content[i];
        let attrs = '';

        for (const attr in content.attrs) {
            if (attr === 'style') {
                const styles = content.attrs[attr];
                let styleString = '';

                for (let j = 0; j < styles?.length; j++) {
                    styleString += `${styles[j].key}: ${styles[j].value};`;
                }

                attrs += `style="${styleString}" `;
            } else if (attr === 'fromPaste' || attr === 'pastePass') {
                // Ignore these attributes
            } else {
                attrs += `${attr}="${content.attrs[attr]}" `;
            }
        }

        if (content.type === 'paragraph') {
            html += `<p ${attrs}>`;

            if (content.content) {
                for (let j = 0; j < content.content.length; j++) {
                    const subContent = content.content[j];

                    if (subContent.type === 'text') {
                        html += subContent.text;
                    } else if (subContent.type === 'link') {
                        let linkAttrs = '';

                        for (const linkAttr in subContent.attrs) {
                            linkAttrs += `${linkAttr}="${subContent.attrs[linkAttr]}" `;
                        }

                        html += `<a ${linkAttrs}>${subContent.content.filter((c) => c.type === 'text').map((c) => c.text).join(' ')}</a>`;
                    }
                }
            }

            html += '</p>';
        } else if (content.type === 'image') {
            let imgAttrs = '';

            for (const imgAttr in content.attrs) {
                imgAttrs += `${imgAttr}="${content.attrs[imgAttr]}" `;
            }

            html += `<img ${imgAttrs}/>`;
        }
    }

    return html;
}


const ProcessFeed = async (list, cache) => {
    const detailUrl = 'https://www.infoq.cn/public/v1/article/getDetail';

    const items = await Promise.all(
        list.map(async (e) => {
            const uuid = e.uuid;
            const single = await cache.tryGet(uuid, async () => {
                const link = `https://www.infoq.cn/article/${uuid}`;
                const resp = await got({
                    method: 'post',
                    url: detailUrl,
                    headers: {
                        Referer: link,
                    },
                    json: {
                        uuid: uuid,
                    },
                });


                const data = resp.data.data;

                const content_response = await got({
                    url: data.content_url,
                    method: 'get',
                    headers: {
                        Referer: link,
                    },
                });

                const html = typeof content_response.data === 'string' ? content_response.data : renderHtml(content_response.data);

                const author = data.author ? data.author.map((p) => p.nickname).join(',') : data.no_author;
                const pubDate = new Date();
                pubDate.setTime(data.publish_time);

                return {
                    title: data.article_title,
                    description: html,
                    pubDate,
                    author: author,
                    link,
                };
            });

            return Promise.resolve(single);
        })
    );

    return items;
};

const parseToSimpleText = (content) => parseToSimpleTexts(content).join('');
const parseToSimpleTexts = (content) =>
    content.map((i) => {
        const funcMaps = {
            doc: () =>
                parseToSimpleTexts(i.content)
                    .map((v) => `<p>${v}</p>`)
                    .join(''),
            text: () => i.text,
            heading: () => {
                if (i.content) {
                    const level = i.attrs.level;
                    const text = parseToSimpleText(i.content);
                    return `<h${level}>${text}</h${level}>`;
                } else {
                    return '';
                }
            },
            blockquote: () => {
                const text = parseToSimpleText(i.content);
                return `<blockquote>${text}</blockquote>`;
            },
            image: () => {
                const img = i.attrs.src;
                return `<img src="${img}"></img>`;
            },
            codeblock: () => {
                const lang = i.attrs.lang;
                const code = parseToSimpleText(i.content);
                return `<code lang="${lang}">${code}</code>`;
            },
            link: () => {
                const href = i.attrs.href;
                const text = parseToSimpleText(i.content || []);
                return `<a href="${href}">${text}</a>"`;
            },
        };

        if (i.type in funcMaps) {
            return funcMaps[i.type]();
        }

        if (!i.content) {
            return '';
        }

        return parseToSimpleText(i.content);
    });


module.exports = {
    ProcessFeed,
};
