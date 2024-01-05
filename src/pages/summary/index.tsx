export default function Summary() {
  return (
    <div className="bg-main-light layout-x-padding py-10">
      <div className="layout-max-width mx-auto grid w-full max-w-7xl grid-rows-[auto_1fr] gap-10">
        <div className="card grid h-96 w-full place-content-center">
          Summary
        </div>
      </div>
    </div>
  );
}

Summary.auth = true;
