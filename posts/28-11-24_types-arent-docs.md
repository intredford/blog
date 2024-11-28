# Типы — не документация

По скрытой от меня причине vscode стал считать, что декларации типов это самый лучший способ рассказать о чём-то. Каждый раз, когда я хочу подсмотреть аргументы, он выдаёт мне кучу магических закорючек:

![JSON.stringify(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string](/public/post-img/vscode-tooltips/json-stringify.png)

В этом примере и рассказывать-то даже особо нечего. Могу даже словами сказать: «метод принимает значение, функцию замены (которая знает ключ и значение каждого объекта) и ширину отступа». Всё. Получилось даже на 3 символа короче.

Но это ещё не так плохо. Клинический случай — библиотека Telegraf.js. Вот её подсказка к методу, отправляющему сообщение в Телеграме:

![reply(text: string | FmtString<string>, extra?: Omit<{ chat_id: number | string; message_thread_id?: number; text: string; parse_mode?: ParseMode; entities?: MessageEntity[]; link_preview_options?: LinkPreviewOptions; disable_notification?: boolean; protect_content?: boolean; reply_parameters?: ReplyParameters; reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply; }, "text" | "chat_id"> | undefined): Promise<Message.TextMessage>](/public/post-img/vscode-tooltips/telegraf.png)

Спасибо, очень полезно. [Сайт с документацией](https://telegraf.js.org/modules.html) у них, кстати, такой же.