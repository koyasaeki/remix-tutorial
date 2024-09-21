// Remix ではこのファイルを Root Route と呼ぶ。
// このコンポーネントは描画する UI の中で最初に呼び出される。
// ゆえに、ページのグローバルなレイアウトを定義するのに適している。

import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
// vite の機能。 ?url で URL としてインポートできる。
import appStylesHref from "./app.css?url";
import { createEmptyContact, getContacts } from "./data";

// head タグ内に link を追加できる。
// 今回はスタイルシートが追加される。
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

// loader と useLoaderData を利用して、データを読み込みできる。
export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
};

// form の POST リクエストの処理を行う。
export const action = async () => {
  const contact = createEmptyContact();
  return json({ contact });
};

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <Link to={`/contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? <span>*</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>

        {/*
          Remix は React Router の上に構築されている。
          そのため、ネストルーティングをサポートしている。
          親レイアウトの中で子ルートを描画するために、Outlet コンポーネントを使う。
         */}
        <div id="detail">
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
