# delfi-parser
Russian [**Delfi**](https://rus.delfi.lv/) news parser with sending them to **Discord** using **webhook**.
___
### Installation
- Clone the repository:
```bash
git clone https://github.com/kitaminka/delfi-parser.git
```
- Install dependencies:
```bash
yarn
```
- [**Edit config.json file**](#message-customization) and put your [**Discord webhook URL**](#webhook-creation) in this file.
- Start the program:
```bash
yarn start
```
___
### Message customization
- Edit **config.json** file to customize the message.

![Screenshot](https://i.imgur.com/MeUNPsz.png)

- In any of the settings, you can use the following variables:

| Variable            | Description            | Example value                                                                                                                                                                                                                                                       |
|---------------------|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **{{title}}**       | News title             | Состоятся авиарейсы по возвращению жителей Латвии из Египта                                                                                                                                                                                                         |
| **{{description}}** | News description       | Сегодня состоятся согласованные Министерством сообщения и Министерством иностранных дел авиарейсы из Египта, чтобы на родину могли вернуться латвийцы, которые путешествовали рейсом, организованным подпавшим под антироссийские санкции туроператором TT Baltics. |
| **{{image}}**       | Link to the news image | https://g4.delphi.lv/images/pix/676x385/dSop4_NZRlQ/lidmasina-lidmasinas-53968257.jpg                                                                                                                                                                               |
| **{{link}}**        | Link to the news page  | https://rus.delfi.lv/news/daily/latvia/sostoyatsya-aviarejsy-po-vozvrascheniyu-zhitelej-latvii-iz-egipta.d?id=54123886                                                                                                                                              |
___
### Webhook Creation
- Create text channel on your Discord server.

![Screenshot](https://i.imgur.com/iVO3aYm.png)
- Open channel settings and create webhook.

![Screenshot](https://i.imgur.com/c6PGThG.png)
- Copy **webhook URL**.

![Screenshot](https://i.imgur.com/rTdUSZO.png)
___
