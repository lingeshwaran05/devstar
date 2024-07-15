<script>
  import { writable } from "svelte/store";
  import jsPDF from "jspdf";

  let name = writable("");
  let email = writable("");
  let phone = writable("");

  let education = writable([]);
  let projects = writable([]);
  let skills = writable([]);
  let experience = writable([]);
  let certificates = writable([]);
  let achievements = writable([]);

  let newSkill = writable("");

  function getBulletPoints(text) {
    return text.split("\n").filter((line) => line.trim() !== "");
  }

  function addEducation() {
    education.update((n) => [
      ...n,
      {
        title: "",
        grade: "",
        description: "",
        startDate: "",
        endDate: "",
        expanded: true,
        submitted: false,
      },
    ]);
  }

  function submitEducation(index) {
    education.update((items) => {
      const edu = items[index];
      if (
        !edu.title ||
        !edu.grade ||
        // !edu.description ||
        !edu.startDate ||
        !edu.endDate
      ) {
        alert("Please fill in all fields.");
        return items;
      }
      items[index].submitted = true;
      return items;
    });
  }

  function addProject() {
    projects.update((n) => [
      ...n,
      {
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        expanded: true,
        submitted: false,
      },
    ]);
  }

  function submitProject(index) {
    projects.update((items) => {
      const proj = items[index];
      if (
        !proj.title ||
        !proj.description ||
        !proj.startDate ||
        !proj.endDate
      ) {
        alert("Please fill in all fields.");
        return items;
      }
      items[index].submitted = true;
      return items;
    });
  }

  function addExperience() {
    experience.update((n) => [
      ...n,
      {
        title: "",
        company: "",
        description: "",
        startDate: "",
        endDate: "",
        expanded: true,
        submitted: false,
      },
    ]);
  }

  function submitExperience(index) {
    experience.update((items) => {
      const exp = items[index];
      if (
        !exp.title ||
        !exp.company ||
        !exp.description ||
        !exp.startDate ||
        !exp.endDate
      ) {
        alert("Please fill in all fields.");
        return items;
      }
      items[index].submitted = true;
      return items;
    });
  }

  function addCertificate() {
    certificates.update((n) => [
      ...n,
      {
        title: "",
        organization: "",
        description: "",
        date: "",
        expanded: true,
        submitted: false,
      },
    ]);
  }

  function submitCertificate(index) {
    certificates.update((items) => {
      const cert = items[index];
      if (
        !cert.title ||
        !cert.organization ||
        // !cert.description ||
        !cert.date
      ) {
        alert("Please fill in all fields.");
        return items;
      }
      items[index].submitted = true;
      return items;
    });
  }

  function addAchievement() {
    achievements.update((n) => [
      ...n,
      {
        title: "",
        description: "",
        date: "",
        expanded: true,
        submitted: false,
      },
    ]);
  }

  function submitAchievement(index) {
    achievements.update((items) => {
      const ach = items[index];
      if (!ach.title || !ach.date) {
        alert("Please fill in all fields.");
        return items;
      }
      items[index].submitted = true;
      return items;
    });
  }

  function deleteBlock(type, index) {
    const stores = {
      education,
      projects,
      experience,
      certificates,
      achievements,
    };
    stores[type].update((items) => items.filter((_, i) => i !== index));
  }

  function toggleExpand(type, index) {
    const stores = {
      education,
      projects,
      experience,
      certificates,
      achievements,
    };
    stores[type].update((items) =>
      items.map((item, i) => {
        if (i === index) {
          return { ...item, expanded: !item.expanded };
        }
        return item;
      })
    );
  }

  function addSkill() {
    const newSkillValue = $newSkill.trim();
    if (newSkillValue !== "") {
      skills.update((n) => [...n, newSkillValue]);
      newSkill.set("");
    } else {
      alert("Please enter a valid skill");
    }
  }

  function deleteSkill(index) {
    skills.update((items) => items.filter((_, i) => i !== index));
  }

  function formatDate(date) {
    if (!date) return "";
    const options = { year: "numeric", month: "long" };
    return new Date(date).toLocaleDateString(undefined, options);
  }

  let resumeContent;

  function downloadPDF() {
    const doc = new jsPDF("p", "pt", "a4");

    doc.html(resumeContent, {
      callback: function (doc) {
        doc.save("resume.pdf");
      },
      x: 10,
      y: 10,
      margin: [0, 0],
      autoPaging: "text",
      html2canvas: { scale: 1 },
    });
  }
</script>

<div class="container mx-auto p-4">
  <div class="flex">
    <form class="w-1/2 p-4">
      <div class="mb-4">
        <label
          class="block text-sm font-medium text-gray-700 items-center"
          for="">Name</label
        >
        <input
          type="text"
          bind:value={$name}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700" for=""
          >Email</label
        >
        <input
          type="email"
          bind:value={$email}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700" for=""
          >Phone</label
        >
        <input
          type="tel"
          bind:value={$phone}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <h2 class="text-xl font-bold mb-2">Education</h2>
      <!-- Education Form with Submit Button -->
      {#each $education as edu, i}
        <div class="mb-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold">
              {edu.title || `Education #${i + 1}`}
            </h3>
            <div>
              <button
                type="button"
                on:click={() => toggleExpand("education", i)}
                class="text-blue-500 mr-2"
              >
                {edu.expanded ? "▲" : "▼"}
              </button>
              <button
                type="button"
                on:click={() => deleteBlock("education", i)}
                class="text-red-500 text-sm">❌</button
              >
            </div>
          </div>
          {#if edu.expanded}
            <label class="block text-sm font-medium text-gray-700" for=""
              >Title</label
            >
            <input
              type="text"
              bind:value={edu.title}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <label class="block text-sm font-medium text-gray-700" for=""
              >Grade</label
            >
            <input
              type="text"
              bind:value={edu.grade}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <label class="block text-sm font-medium text-gray-700" for=""
              >Description</label
            >
            <textarea
              bind:value={edu.description}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
            <label class="block text-sm font-medium text-gray-700" for=""
              >Start Date</label
            >
            <input
              type="month"
              bind:value={edu.startDate}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <label class="block text-sm font-medium text-gray-700" for=""
              >End Date</label
            >
            <input
              type="month"
              bind:value={edu.endDate}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              on:click={() => submitEducation(i)}
              class="bg-green-500 text-white px-3 py-2 rounded-md mt-2 hover:bg-green-700"
            >
              Submit
            </button>
          {/if}
        </div>
      {/each}
      <button
        type="button"
        on:click={addEducation}
        class="bg-blue-500 text-white px-3 py-2 rounded-md mb-4 hover:bg-blue-700"
      >
        Add Education
      </button>

      <h2 class="text-xl font-bold mb-2">Skills</h2>
      <div class="flex mb-4">
        <input
          type="text"
          bind:value={$newSkill}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Add a skill"
        />
        <button
          type="button"
          on:click={addSkill}
          class="bg-blue-500 text-white px-3 py-2 rounded-md ml-2 hover:bg-blue-700"
          >Add Skill</button
        >
      </div>
      <div class="skills-container">
        {#each $skills as skill, i}
          <div class="skill relative">
            {skill}
            <button
              type="button"
              on:click={() => deleteSkill(i)}
              class="absolute right-0 text-red-500 text-sm">⨯</button
            >
          </div>
        {/each}
      </div>

      <h2 class="text-xl font-bold mb-2">Projects</h2>

      {#each $projects as proj, i}
        <div class="mb-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold">
              {proj.title || `Project #${i + 1}`}
            </h3>
            <div>
              <button
                type="button"
                on:click={() => toggleExpand("projects", i)}
                class="text-blue-500 mr-2"
              >
                {proj.expanded ? "▲" : "▼"}
              </button>
              <button
                type="button"
                on:click={() => deleteBlock("projects", i)}
                class="text-red-500 text-sm">❌</button
              >
            </div>
          </div>
          {#if proj.expanded}
            <label class="block text-sm font-medium text-gray-700" for=""
              >Title</label
            >
            <input
              type="text"
              bind:value={proj.title}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <label class="block text-sm font-medium text-gray-700" for=""
              >Description</label
            >
            <textarea
              bind:value={proj.description}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
            <label class="block text-sm font-medium text-gray-700" for=""
              >Start Date</label
            >
            <input
              type="month"
              bind:value={proj.startDate}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <label class="block text-sm font-medium text-gray-700" for=""
              >End Date</label
            >
            <input
              type="month"
              bind:value={proj.endDate}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              on:click={() => submitProject(i)}
              class="bg-green-500 text-white px-3 py-2 rounded-md mt-2 hover:bg-green-700"
            >
              Submit
            </button>
          {/if}
        </div>
      {/each}
      <button
        type="button"
        on:click={addProject}
        class="bg-blue-500 text-white px-3 py-2 rounded-md mb-4 hover:bg-blue-700"
      >
        Add Project
      </button>

      <h2 class="text-xl font-bold mb-2">Professional Experience</h2>

      {#each $experience as exp, i}
        <div class="mb-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold">
              {exp.title || `Experience #${i + 1}`}
            </h3>
            <div>
              <button
                type="button"
                on:click={() => toggleExpand("experience", i)}
                class="text-blue-500 mr-2"
              >
                {exp.expanded ? "▲" : "▼"}
              </button>
              <button
                type="button"
                on:click={() => deleteBlock("experience", i)}
                class="text-red-500 text-sm">❌</button
              >
            </div>
          </div>
          {#if exp.expanded}
            <label class="block text-sm font-medium text-gray-700" for=""
              >Title</label
            >
            <input
              type="text"
              bind:value={exp.title}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <label class="block text-sm font-medium text-gray-700" for=""
              >Company</label
            >
            <input
              type="text"
              bind:value={exp.company}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <label class="block text-sm font-medium text-gray-700" for=""
              >Description</label
            >
            <textarea
              bind:value={exp.description}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
            <label class="block text-sm font-medium text-gray-700" for=""
              >Start Date</label
            >
            <input
              type="month"
              bind:value={exp.startDate}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <label class="block text-sm font-medium text-gray-700" for=""
              >End Date</label
            >
            <input
              type="month"
              bind:value={exp.endDate}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              on:click={() => submitExperience(i)}
              class="bg-green-500 text-white px-3 py-2 rounded-md mt-2 hover:bg-green-700"
            >
              Submit
            </button>
          {/if}
        </div>
      {/each}
      <button
        type="button"
        on:click={addExperience}
        class="bg-blue-500 text-white px-3 py-2 rounded-md mb-4 hover:bg-blue-700"
      >
        Add Experience
      </button>

      <h2 class="text-xl font-bold mb-2">Certificates</h2>

      {#each $certificates as cert, i}
        <div class="mb-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold">
              {cert.title || `Certificate #${i + 1}`}
            </h3>
            <div>
              <button
                type="button"
                on:click={() => toggleExpand("certificates", i)}
                class="text-blue-500 mr-2"
              >
                {cert.expanded ? "▲" : "▼"}
              </button>
              <button
                type="button"
                on:click={() => deleteBlock("certificates", i)}
                class="text-red-500 text-sm">❌</button
              >
            </div>
          </div>
          {#if cert.expanded}
            <label class="block text-sm font-medium text-gray-700" for=""
              >Title</label
            >
            <input
              type="text"
              bind:value={cert.title}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <label class="block text-sm font-medium text-gray-700" for=""
              >Organization</label
            >
            <input
              type="text"
              bind:value={cert.organization}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <label class="block text-sm font-medium text-gray-700" for=""
              >Description</label
            >
            <textarea
              bind:value={cert.description}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
            <label class="block text-sm font-medium text-gray-700" for=""
              >Date</label
            >
            <input
              type="month"
              bind:value={cert.date}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              on:click={() => submitCertificate(i)}
              class="bg-green-500 text-white px-3 py-2 rounded-md mt-2 hover:bg-green-700"
            >
              Submit
            </button>
          {/if}
        </div>
      {/each}
      <button
        type="button"
        on:click={addCertificate}
        class="bg-blue-500 text-white px-3 py-2 rounded-md mb-4 hover:bg-blue-700"
      >
        Add Certificate
      </button>

      <h2 class="text-xl font-bold mb-2">Achievements</h2>

      {#each $achievements as ach, i}
        <div class="mb-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold">
              {ach.title || `Achievement #${i + 1}`}
            </h3>
            <div>
              <button
                type="button"
                on:click={() => toggleExpand("achievements", i)}
                class="text-blue-500 mr-2"
              >
                {ach.expanded ? "▲" : "▼"}
              </button>
              <button
                type="button"
                on:click={() => deleteBlock("achievements", i)}
                class="text-red-500 text-sm">❌</button
              >
            </div>
          </div>
          {#if ach.expanded}
            <label class="block text-sm font-medium text-gray-700" for=""
              >Title</label
            >
            <input
              type="text"
              bind:value={ach.title}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <label class="block text-sm font-medium text-gray-700" for=""
              >Description</label
            >
            <textarea
              bind:value={ach.description}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
            <label class="block text-sm font-medium text-gray-700" for=""
              >Date</label
            >
            <input
              type="month"
              bind:value={ach.date}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              on:click={() => submitAchievement(i)}
              class="bg-green-500 text-white px-3 py-2 rounded-md mt-2 hover:bg-green-700"
            >
              Submit
            </button>
          {/if}
        </div>
      {/each}
      <button
        type="button"
        on:click={addAchievement}
        class="bg-blue-500 text-white px-3 py-2 rounded-md mb-4 hover:bg-blue-700"
      >
        Add Achievement
      </button>
    </form>

    <div class="w-1/2 p-4">
      <h1 class="text-2xl font-bold">Preview</h1>
      <div bind:this={resumeContent} class="bg-white p-4 rounded-lg shadow-md">
        <!-- <h2 class="text-xl font-bold">Personal Information</h2> -->
        <p class="flex justify-center font-bold text-lg">{$name}</p>
        <div class="flex justify-center">
          <p class="px-4">{$email}</p>
          <p class="px-4">{$phone}</p>
        </div>
        <!-- <hr class="border-black mt-2" /> -->

        {#if $education.filter((e) => e.submitted).length > 0}
          <h2 class="text-xl font-bold mt-4 mb-2">Education</h2>
          <hr class="border-black mb-2" />
          {#each $education.filter((e) => e.submitted) as edu}
            <div class="mb-2">
              <div class="flex justify-between">
                <h3 class="text-lg font-bold">{edu.title}</h3>
                <p>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </p>
              </div>
              <p>Grade: {edu.grade}</p>
              <ul class="list-disc pl-5 mt-4 w-full">
                {#each getBulletPoints(edu.description) as line}
                  <li>{line}</li>
                {/each}
              </ul>
            </div>
          {/each}
        {/if}

        {#if $skills.length > 0}
          <div class="section">
            <h2 class="text-xl font-bold mt-4 mb-2">Skills</h2>
            <hr class="border-black mb-2" />
            <div class="skills-container">
              {#each $skills as skill}
                <div class="skill">{skill}</div>
              {/each}
            </div>
          </div>
        {/if}

        {#if $projects.filter((p) => p.submitted).length > 0}
          <h2 class="text-xl font-bold mt-4 mb-2">Projects</h2>
          <hr class="border-black mb-2" />
          {#each $projects.filter((p) => p.submitted) as proj}
            <div class="mb-2">
              <div class="flex justify-between">
                <h3 class="text-lg font-bold">{proj.title}</h3>
                <p>
                  {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                </p>
              </div>
              <ul class="list-disc pl-5 mt-4 w-full">
                {#each getBulletPoints(proj.description) as line}
                  <li>{line}</li>
                {/each}
              </ul>
            </div>
          {/each}
        {/if}

        {#if $experience.filter((e) => e.submitted).length > 0}
          <h2 class="text-xl font-bold mt-4 mb-2">Experience</h2>
          <hr class="border-black mb-2" />
          {#each $experience.filter((e) => e.submitted) as exp}
            <div class="mb-2">
              <div class="flex justify-between">
                <h3 class="text-lg font-bold">{exp.title}</h3>
                <p>
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </p>
              </div>
              <p>{exp.company}</p>
              <ul class="list-disc pl-5 mt-4 w-full">
                {#each getBulletPoints(exp.description) as line}
                  <li>{line}</li>
                {/each}
              </ul>
            </div>
          {/each}
        {/if}

        {#if $certificates.filter((c) => c.submitted).length > 0}
          <h2 class="text-xl font-bold mt-4 mb-2">Certificates</h2>
          <hr class="border-black mb-2" />
          {#each $certificates.filter((c) => c.submitted) as cert}
            <div class="mb-2">
              <div class="flex justify-between">
                <h3 class="text-lg font-bold">{cert.title}</h3>
                <p>{formatDate(cert.date)}</p>
              </div>
              <p>{cert.organization}</p>
              <ul class="list-disc pl-5 mt-4 w-full">
                {#each getBulletPoints(cert.description) as line}
                  <li>{line}</li>
                {/each}
              </ul>
            </div>
          {/each}
        {/if}

        {#if $achievements.filter((a) => a.submitted).length > 0}
          <h2 class="text-xl font-bold mt-4 mb-2">Achievements</h2>
          <hr class="border-black mb-2" />
          {#each $achievements.filter((a) => a.submitted) as ach}
            <div class="mb-2">
              <div class="flex justify-between">
                <h3 class="text-lg font-bold">{ach.title}</h3>
                <p>{formatDate(ach.date)}</p>
              </div>
              <ul class="list-disc pl-5 mt-4 w-full">
                {#each getBulletPoints(ach.description) as line}
                  <li>{line}</li>
                {/each}
              </ul>
            </div>
          {/each}
        {/if}
      </div>
      <button
        type="button"
        on:click={downloadPDF}
        class="bg-green-500 text-white px-3 py-2 rounded-md mt-4 hover:bg-green-700"
      >
        Download PDF
      </button>
    </div>
  </div>
</div>

<style>
  .skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .skill {
    background-color: #f3f4f6;
    padding: 2px 10px;
    border-radius: 5px;
    position: relative;
    padding-bottom: 10px;
  }

  .skill button {
    background: none;
    border: none;
    color: inherit;
    padding: 0;
    font: inherit;
    cursor: pointer;
  }
</style>
