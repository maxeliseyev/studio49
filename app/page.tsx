import { IntroExperience } from "./components/intro-experience";

export default function Home() {
  return (
    <main>
      <IntroExperience />
      <footer className="closing-footer">
        <p className="legal-notice">* Принадлежит Meta — организации, деятельность которой запрещена в РФ</p>
        <p className="copyright" aria-label="S—49, copyright 2026">
          S—49©2026
        </p>
      </footer>
    </main>
  );
}
