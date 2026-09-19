import React from "react";
import "./About.css";

const makers = [
  { name: "Studio Kern", craft: "Woodwork", note: "A two-person shop outside Asheville, cutting kitchen tools from salvaged hardwood." },
  { name: "Moor & Clay", craft: "Ceramics", note: "One potter, one kiln, one wheel. Fires in small batches every six weeks." },
  { name: "Harbor Goods", craft: "Canvas & leather", note: "Sews from bolt-ends and remnant leather other workshops discard." },
];

function About() {
  return (
    <div className="about">
      <section className="container about__intro">
        <p className="hero__eyebrow">Why we exist</p>
        <h1 className="about__title">We stock what makers finish, not what factories can repeat.</h1>
        <div className="shelf" />
        <p className="about__lead">
          Trending Show started as a shared shelf at a Saturday market in 2019.
          We kept the same rule when we moved online: list it once it&apos;s
          made, take it down once it&apos;s gone.
        </p>
      </section>
      <section className="container about__makers">
        <h2>The people behind the shelf</h2>
        <div className="shelf about__rule" />
        <div className="about__grid">
          {makers.map((m) => (
            <div className="about__card" key={m.name}>
              <h3>{m.name}</h3>
              <p className="about__craft">{m.craft}</p>
              <p className="about__note">{m.note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
export default About;
