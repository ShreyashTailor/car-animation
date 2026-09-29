"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WELCOME = "WELCOME ITZFIZZ".split("");

const STATS = [
  { id: "box1", value: "58%", label: "Increase in pick up point use", style: { top: "5%", right: "30%" } },
  { id: "box2", value: "23%", label: "Decreased in customer phone calls", style: { bottom: "5%", right: "35%" } },
  { id: "box3", value: "27%", label: "Increase in pick up point use", style: { top: "5%", right: "10%" } },
  { id: "box4", value: "40%", label: "Decreased in customer phone calls", style: { bottom: "5%", right: "12.5%" } },
];

export default function CarScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLImageElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const car = carRef.current!;
      const trail = trailRef.current!;
      const valueAdd = valueRef.current!;
      const letters = gsap.utils.toArray<HTMLElement>(".value-letter");

      const valueRect = valueAdd.getBoundingClientRect();
      const letterOffsets = letters.map((l) => l.offsetLeft);

      const roadWidth = window.innerWidth;
      const carWidth = 150;
      const endX = roadWidth - carWidth;

      gsap.to(car, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: trackRef.current,
        },
        x: endX,
        ease: "none",
        onUpdate() {
          const carX = (gsap.getProperty(car, "x") as number) + carWidth / 2;
          letters.forEach((letter, i) => {
            const letterX = valueRect.left + letterOffsets[i];
            letter.style.opacity = carX >= letterX ? "1" : "0";
          });
          gsap.set(trail, { width: carX });
        },
      });

      STATS.forEach((s, i) => {
        gsap.to(`#${s.id}`, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top+=${400 + i * 200} top`,
            end: `top+=${600 + i * 200} top`,
            scrub: true,
          },
          opacity: 1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="section" ref={sectionRef}>
      <div className="track" ref={trackRef}>
        <div className="road" id="road">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/car.png" alt="car" className="car" id="car" ref={carRef} />
          <div className="trail" id="trail" ref={trailRef} />
          <div className="value-add" id="valueText" ref={valueRef} style={{ top: "30%" }}>
            {WELCOME.map((ch, i) => (
              <span key={i} className="value-letter">
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </div>
        </div>

        {STATS.map((s) => (
          <div key={s.id} className="text-box" id={s.id} style={s.style}>
            <span className="num-box">{s.value}</span> {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}
