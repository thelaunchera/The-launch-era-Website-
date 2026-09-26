const routeStops = [
  { time: "9:00 AM", client: "Johnson Home", address: "Palm Beach County", duration: "2h", status: "Next" },
  { time: "12:00 PM", client: "Rivera Home", address: "Palm Beach County", duration: "2.5h", status: "Scheduled" },
  { time: "3:30 PM", client: "Miller Home", address: "Palm Beach County", duration: "1.5h", status: "Scheduled" },
];

const nav = ["Today","Leads","Clients","Calendar","Quotes","Invoices","Services","Team","Reports","Settings"];

export default function Home() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">THE LAUNCH ERA<small>CLEANING APP</small></div>
        <nav className="nav">
          {nav.map((item, index) => <a className={index===0 ? "active" : ""} href="#" key={item}>{item}</a>)}
        </nav>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <div className="eyebrow">Friday · Daily operations</div>
            <h1>Today, without the chaos.</h1>
            <p className="subtitle">Jobs, route, leads and money that need your attention — in one place.</p>
          </div>
          <div className="actions">
            <button className="btn">Español</button>
            <button className="btn primary">+ New</button>
          </div>
        </div>

        <section className="grid">
          <article className="card metric"><span className="eyebrow">Jobs today</span><b>3</b><span className="meta">6 hours scheduled</span></article>
          <article className="card metric"><span className="eyebrow">New leads</span><b>2</b><span className="meta">Need a reply</span></article>
          <article className="card metric"><span className="eyebrow">Quotes</span><b>1</b><span className="meta">Waiting for approval</span></article>
          <article className="card metric"><span className="eyebrow">Unpaid</span><b>$245</b><span className="meta">2 invoices</span></article>

          <article className="card route">
            <div className="section-title"><h2>Today&apos;s Route</h2><span className="badge">18.4 mi estimated</span></div>
            {routeStops.map((stop,index)=>(
              <div className="stop" key={stop.client}>
                <div className="order">{index+1}</div>
                <div>
                  <strong>{stop.time} · {stop.client}</strong>
                  <div className="meta">{stop.address} · {stop.duration} job · travel buffer included</div>
                </div>
                <span className="status">{stop.status}</span>
              </div>
            ))}
          </article>

          <aside className="card sidecard">
            <div className="section-title"><h2>Quick actions</h2></div>
            <div className="quick">
              <button>+ Add lead</button>
              <button>+ Create quote</button>
              <button>+ Book job</button>
              <button>Start mileage</button>
              <button>Clock into job</button>
            </div>
          </aside>

          <article className="card route">
            <div className="section-title"><h2>What needs attention</h2><span className="badge">Owner view</span></div>
            <div className="note">
              A quote request stays in <strong>Quotes</strong> until the customer accepts it. Acceptance will create/update the client, add the job to the calendar and prepare the invoice.
            </div>
          </article>

          <aside className="card sidecard">
            <div className="section-title"><h2>Daily totals</h2></div>
            <div className="quick">
              <button>Driving · 18.4 mi</button>
              <button>Work time · 6h</button>
              <button>Scheduled revenue · $510</button>
            </div>
          </aside>
        </section>
      </main>

      <nav className="mobile-nav">
        {["Today","Leads","Calendar","Clients","More"].map((item)=><a href="#" key={item}>{item}</a>)}
      </nav>
    </div>
  );
}
