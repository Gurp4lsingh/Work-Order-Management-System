export default function HelpPage() {
  return (
    <div>
      <h2>Help</h2>
      <section className="panel">
        <h3>CSV Template</h3>
        <p>Required headers: title, description, department, priority, requesterName</p>
        <p>Optional header: assignee</p>
        <pre>
          title,description,department,priority,requesterName,assignee
          {"\n"}Fix HVAC,Air conditioning unit fault in floor 2,FACILITIES,HIGH,Anita,Raj
        </pre>
      </section>
      <section className="panel">
        <h3>Status Lifecycle</h3>
        <ul>
          <li>NEW -&gt; IN_PROGRESS</li>
          <li>IN_PROGRESS -&gt; BLOCKED or DONE</li>
          <li>BLOCKED -&gt; IN_PROGRESS</li>
          <li>DONE - no transitions</li>
        </ul>
      </section>
    </div>
  );
}
