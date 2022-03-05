import Discord from 'discord.js';
import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';
import HTMLToText from 'html-to-text';
import 'dotenv/config'
import { buildEmbed } from './embed.mjs';

const webhookClient = new Discord.WebhookClient({ url: process.env.WEBHOOK_ULR });

let previousLinks = [];

fetch('https://rus.delfi.lv/news/novosti/', {
    method: 'GET'
}).then(res => res.text()).then((mainPage) => {
    const mainPageHTML = HTMLParser.parse(mainPage);
    const linkElements = mainPageHTML.querySelectorAll('div#ajax-headlines>div.row>div.mb-4>a');
    for (const link of linkElements) {
        previousLinks.push(link.attrs.href.split('?id=')[1]);
    }
});

setInterval(async () => {
    console.log('Parsing news...');

    const mainPage = await fetch('https://rus.delfi.lv/news/novosti/', {
        method: 'GET'
    }).then(res => res.text());

    const mainPageHTML = HTMLParser.parse(mainPage);
    const links = mainPageHTML.querySelectorAll('div#ajax-headlines>div.row>div.mb-4>a');
    const images = mainPageHTML.querySelectorAll('.img-fluid.w-100.lazy-img.disable-lazy');

    for (let i = 3; i >= 0; i--) {
        const link = links[i];
        const image = images[i];

        if (!previousLinks.includes(link.attrs.href.split('?id=')[1])) {
            const newsInfo = {link: link.attrs.href};
            newsInfo.title = HTMLToText.convert(image.attrs.alt, {
                wordwrap: 130
            });
            const newsPage = await fetch(link.attrs.href, {
                method: 'GET'
            }).then(res => res.text());
            const newsPageHTML = HTMLParser.parse(newsPage);
            const description = newsPageHTML.querySelector('p.font-weight-bold');
            newsInfo.description = HTMLToText.convert(description.innerHTML, {
                wordwrap: 130,
                selectors: [
                    {
                        selector: 'a',
                        options: {
                            ignoreHref: '*'
                        }
                    }
                ]
            }).replaceAll('\n', ' ');

            const embed = buildEmbed(newsInfo);

            // const embed = new Discord.MessageEmbed()
            //     .setColor('#0062ff')
            //     .setURL(link.attrs.href)
            //     .setTitle(titleText)
            //     .setDescription(descriptionText)
            //     .setImage(image.attrs.src);

            await webhookClient.send({
                embeds:[embed]
            });
            console.log(`Sent:\nID: ${link.attrs.href.split('?id=')[1]}\nTitle: ${titleText}\nLink: ${link.attrs.href}`);
        }
    }
    previousLinks = [];
    for (const link of links) {
        previousLinks.push(link.attrs.href.split('?id=')[1]);
    }
    console.log('Parsing finished!');
}, process.env.INTERVAL_MS);