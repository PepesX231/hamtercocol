// The map page moved to the top of the home page (owner, 27 พ.ย.). Old links to /map/ land here and move on.
export default function Page() {
  return (
    <main style={{ padding: "140px 16px", textAlign: "center" }}>
      <meta httpEquiv="refresh" content="0; url=/hamtercocol/next/" />
      <script dangerouslySetInnerHTML={{ __html: "location.replace('/hamtercocol/next/')" }} />
      <a href="/hamtercocol/next/">ไปหน้าแรก</a>
    </main>
  );
}
