export default function ResumePreview({ data }) {
    
const p = data?.personalDetails
 

  return (
    <div className="w-full text-gray-900 font-sans leading-normal">

      {/* NAME */}
      {p.fullName && (
        <h1 className="text-center text-[26px] font-bold mb-1">
          {p.fullName}
        </h1>
      )}

      {/* PROFESSIONAL TITLE */}
      {p.professionalTitle && (
        <p className="text-center text-[13px] font-semibold text-gray-700 mb-2">
          {p.professionalTitle}
        </p>
      )}

      {/*  CONTACT LINE 1 */}
      {(p.email || p.phone || p.location) && (
        <p className="text-center text-[11px] mb-1">
          {p.email && <>Email: {p.email}</>}
          {p.phone && <> | Phone: {p.phone}</>}
          {p.location && <> | Location: {p.location}</>}
        </p>
      )}

      {/* CONTACT LINE 2 (LINKS) */}
      {(p.github || p.linkedin || p.portfolio) && (
        <p className="text-center text-[11px] mb-4">
          {p.github && <>GitHub: {p.github}</>}
          {p.linkedin && <> | LinkedIn: {p.linkedin}</>}
          {p.portfolio && <> | Portfolio: {p.portfolio}</>}
        </p>
      )}

      {/* SUMMARY (ATS-FRIENDLY PARAGRAPH) */}
      {p.summary && (
        <p className="text-[11.5px] text-gray-800 text-justify mb-6">
          {p.summary && (
            <div
              className="prose prose-sm text-sm mt-2 ml-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: p.summary }}
            />
          )}
        </p>
      )}
      {data?.skills?.isVisible && (<section className="mb-8">
  <h2 className="text-xl font-bold border-b border-gray-700 pb-1 mb-4">
    Skills
  </h2>

  {data?.skills.isVisible &&
    (data.skills.entries.length === 0 ||
    data.skills.entries.every(skill => !skill.domain) ? (
      <p className="text-gray-600 text-sm italic">
        No skills added.
      </p>
    ) : (
      <div className="space-y-2">
        {data.skills.entries.map((skill, index) => (
          <div key={index} className="text-[15px] text-black-500 leading-relaxed">

            {/* Domain (bold) and Sub-skills (inline, separated by commas) */}
            <span className="font-semibold">
              {skill.domain ? `${skill.domain}: ` : "Skill Domain: "}
            </span>

            <span className="text-gray-700">
              {skill.subSkills || "Sub-skills go here"}
            </span>
            {skill.description && (
            <div
              className="prose prose-sm text-sm mt-2 ml-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: skill.description }}
            />
          )}
       
          </div>
        ))}

      </div>
    ))
  }
</section>)}
    

{data?.experience?.isVisible && (<section className="mb-8">
  <h2 className="text-xl font-bold border-b border-gray-700 pb-1 mb-4">
    Experience
  </h2>

  {data.experiences.isVisible &&
    
      data.experiences.entries.map((exp, index) => (
        <div key={index} className="mb-5">
        
          {/* Employer + Location */}
          {(exp.employer || exp.location) && (
            <div className="flex justify-between items-center mt-1">
              <span className=" font-bold text-[15px] text">
                {exp.employer || ""}
              </span>
              <span className="text-sm text-gray-700">
                {exp.location || ""}
              </span>
            </div>
          )}

          {/* Job Title + Employment Type */}
          <div className="flex justify-between items-start">
            <span className="font-semibold text-[15px]">
              
              
              {exp.jobTitle || "Job Title"} 
              {exp.employmentType ? ` (${exp.employmentType})` : ""}
            </span>

            {/* Duration */}
            {(exp.startDate || exp.endDate) && (
              <span className="text-sm text-gray-700">
                {exp.startDate ? exp.startDate : ""}{" "}
                {exp.startDate && exp.endDate ? "–" : ""}
                {exp.endDate ? exp.endDate : ""}
              </span>
            )}
          </div>


          {/* Description */}
          {exp.description && (
            <div
              className="prose prose-sm text-sm mt-2 ml-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: exp.description }}
            />
          )}
        </div>
      ))

  }
</section>)}




{/* projects */}
{data?.projects?.isVisible && (
    <section className="mb-8">
  <h2 className="text-xl font-bold border-b border-gray-700 pb-1 mb-4">
    Projects
  </h2>

  {data.projects.isVisible &&
    (data.projects.entries.length === 0 ||
    data.projects.entries.every(p => !p.projectTitle) ? (
      <p className="text-gray-600 text-sm italic">
        No projects added.
      </p>
    ) : (
      <ul className="list-disc pl-6 space-y-4">
        {data.projects.entries.map((proj, index) => (
          <li key={index} className="leading-relaxed">

            {/* Project Title + Duration */}
            <div className="flex justify-between items-start">
              <span className="font-semibold text-[15px] text-gray-900">
                {proj.projectTitle || "Project Title"}
              </span>
              {(proj.startDate || proj.endDate) && (
                <span className="text-sm text-gray-700">
                  {proj.startDate ? proj.startDate : ""}{" "}
                  {proj.startDate && proj.endDate ? "–" : ""}
                  {proj.endDate ? proj.endDate : ""}
                </span>
              )}
            </div>

            {/* Sub-title (like role / tech stack) */}
            {proj.subTitle && (
              <div className="text-sm italic text-gray-800 mt-1">
                {proj.subTitle}
              </div>
            )}

            {/* Project Link */}
            {proj.projectLink && (
              <div className="text-sm text-blue-600 mt-1">
                <a
                  href={proj.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {proj.projectLink}
                </a>
              </div>
            )}

            {/* Description */}
            {proj.description && (
              <div
                className="prose prose-sm text-sm mt-2 leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: proj.description }}
              />
            )}
          </li>
        ))}
      </ul>
    ))
  }
</section>
)}


{/* education */}
{data?.education?.isVisible && (      <section className="mb-8">
  {data.education.isVisible  && (
    <>
      <h2 className="text-xl font-bold border-b border-gray-700 pb-1 mb-4">
        Education
      </h2>

      {data.education.entries.map((edu, index) =>
        (
          <div key={index} className="mb-6">

            {/* School + Dates */}
            <div className="flex justify-between items-start">
              <span className="font-semibold text-lg">
                {edu.school || "School / University Name"}
              </span>
              <span className="text-sm">
                {edu.startDate || edu.endDate
                  ? `${edu.startDate || ""} - ${edu.endDate || ""}`
                  : ""}
              </span>
            </div>

            {/* Degree + CGPA */}
            <div className="flex justify-between mt-1">
              <span className="italic text-sm">
                {edu.degree || "Degree / Branch"}
              </span>

              {edu.cgpa && (
                <span className="text-sm font-semibold">
                  CGPA: {edu.cgpa}
                </span>
              )}
            </div>

            {/* Location */}
            {edu.location && (
              <div className="text-sm mt-1">{edu.location}</div>
            )}

            {/* Description */}
            {edu.description
 && (
            
  <div
    className="prose prose-sm ml-5 mt-2 text-sm"
    dangerouslySetInnerHTML={{ __html: edu.description }}
  />
  )}         
    </div>
        )
      )}
    </>
  )}
</section>)}


{/* ✅ ACHIEVEMENTS SECTION */}
{data?.achievements?.isVisible &&
  Array.isArray(data.achievements.entries) &&
  data.achievements.entries.length > 0 && (
    <section className="mb-8">
      <h2 className="text-xl font-bold border-b border-gray-700 pb-1 mb-4">
        Achievements
      </h2>

      {data.achievements.entries.map((achv, index) => (
        <div key={index} className="mb-5">

          {/* Title + Date */}
          <div className="flex justify-between items-start">
            <span className="font-semibold text-[15px]">
              {achv.title || "Achievement Title"}
            </span>

            {(achv.date) && (
              <span className="text-sm text-gray-700">
                {achv.date}
              </span>
            )}
          </div>

          {/* Issuer + Location */}
          {(achv.issuer || achv.location) && (
            <div className="flex justify-between items-center mt-1">
              <span className="italic text-sm text-gray-800">
                {achv.issuer || ""}
              </span>

              <span className="text-sm text-gray-700">
                {achv.location || ""}
              </span>
            </div>
          )}

          {/* Description (TinyMCE HTML) */}
          {achv.description && (
            <div
              className="prose prose-sm text-sm mt-2 ml-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: achv.description }}
            />
          )}
        </div>
      ))}
    </section>
  )}


{data?.certifications?.isVisible && (<section className="mb-8">
  <h2 className="text-xl font-bold border-b border-gray-700 pb-1 mb-4">
    Certificates
  </h2>

  {data.certifications.isVisible &&
    (data.certifications.entries.length === 0 ||
    data.certifications.entries.every(c => !c.certificateName) ? (
      <p className="text-gray-600 text-sm italic">
        No certificates added.
      </p>
    ) : (
      data.certifications.entries.map((cert, index) => (
        <div key={index} className="mb-5">

          {/* Certificate Name + Issue Date */}
          <div className="flex justify-between items-start">
            <span className="font-semibold text-[15px]">
              {cert.certificateName || "Certificate Name"}
            </span>
            {cert.issueDate && (
              <span className="text-sm text-gray-700">{cert.issueDate}</span>
            )}
          </div>

          {/* Issuing Organization */}
          {cert.issuingOrganization && (
            <div className="text-sm italic text-gray-800 mt-1">
              {cert.issuingOrganization}
            </div>
          )}

          {/* Credential URL */}
          {cert.credentialURL && (
            <div className="text-sm text-blue-600 mt-1">
              <a href={cert.credentialURL} target="_blank" rel="noopener noreferrer" className="underline">
                View Credential
              </a>
            </div>
          )}

          {/* Additional Info */}
          {cert.additionalInfo && (
            <div
              className="prose prose-sm text-sm mt-2 ml-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: cert.additionalInfo }}
            />
          )}
        </div>
      ))
    ))
  }
</section>)}


{data?.courses?.isVisible && (<section className="mb-8">
  <h2 className="text-xl font-bold border-b border-gray-700 pb-1 mb-4">
    Courses
  </h2>

  {data.courses.isVisible &&
    (data.courses.entries.length === 0 ||
    data.courses.entries.every(c => !c.courseTitle) ? (
      <p className="text-gray-600 text-sm italic">
        No courses added.
      </p>
    ) : (
      data.courses.entries.map((course, index) => (
        <div key={index} className="mb-5">

          {/* Course Title + Duration */}
          <div className="flex justify-between items-start">
            <span className="font-semibold text-[15px]">
              {course.courseTitle || "Course Title"}
            </span>
            {(course.startDate || course.endDate) && (
              <span className="text-sm text-gray-700">
                {course.startDate ? course.startDate : ""}{" "}
                {course.startDate && course.endDate ? "–" : ""}
                {course.endDate ? course.endDate : ""}
              </span>
            )}
          </div>

          {/* Institution + Location */}
          {(course.institution || course.location) && (
            <div className="flex justify-between items-center mt-1">
              <span className="italic text-sm text-gray-800">
                {course.institution || ""}
              </span>
              <span className="text-sm text-gray-700">
                {course.location || ""}
              </span>
            </div>
          )}

          {/* Description */}
          {course.description && (
            <div
              className="prose prose-sm text-sm mt-2 ml-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
          )}
        </div>
      ))
    ))
  }
</section>)}




{data?.interests?.isVisible && (
    <section className="mb-8">
  <h2 className="text-xl font-bold border-b border-gray-700 pb-1 mb-4">
    Interests
  </h2>

  {data.interests.isVisible &&
    (data.interests.entries.length === 0 ||
    data.interests.entries.every(i => !i.interest) ? (
      <p className="text-gray-600 text-sm italic">
        No interests added.
      </p>
    ) : (
      <ul className="list-disc pl-6 space-y-2">
        {data.interests.entries.map((item, index) => (
          <li key={index} className="text-[15px] text-gray-800 leading-relaxed">

            {/* Main Interest */}
            <span className="font-semibold">
              {item.interest || "Interest"}
            </span>

            {/* Additional Info */}
            {item.additionalInfo && (
             <div
                className="prose prose-sm text-sm mt-2 leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: item.additionalInfo }}
              />
            )}
          </li>
        ))}
      </ul>
    ))
  }
</section>
)}


{data?.languages?.isVisible && (<section className="mb-8">
  <h2 className="text-xl font-bold border-b border-gray-700 pb-1 mb-4">
    Languages
  </h2>

  {data.languages.isVisible &&
    (data.languages.entries.length === 0 ||
    data.languages.entries.every(lang => !lang.language) ? (
      <p className="text-gray-600 text-sm italic">
        No languages added.
      </p>
    ) : (
      <ul className="list-disc pl-6 space-y-2">
        {data.languages.entries.map((lang, index) => (
          <li key={index} className="text-[15px] text-gray-800 leading-relaxed">

            {/* Language */}
            <span className="font-semibold">
              {lang.language || "Language"}
            </span>

            {/* Level & Additional Info */}
            {(lang.languageLevel || lang.additionalInfo) && (
              <span className="text-gray-700">
                {": "}
                {lang.languageLevel
                  ? lang.languageLevel.charAt(0).toUpperCase() + lang.languageLevel.slice(1).toLowerCase()
                  : ""}
                {lang.additionalInfo ? (<div
                className="prose prose-sm text-sm mt-2 leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: lang.additionalInfo }}
              />):""}
              </span>
            )}
          </li>
        ))}
      </ul>
    ))
  }
</section>)}

{data?.publications?.isVisible && (
    <section className="mb-8">
  <h2 className="text-xl font-bold border-b border-gray-700 pb-1 mb-4">
    Publications
  </h2>

  {data.publications.isVisible &&
    (data.publications.entries.length === 0 ||
    data.publications.entries.every(pub => !pub.title) ? (
      <p className="text-gray-600 text-sm italic">
        No publications added.
      </p>
    ) : (
      <ul className="list-disc pl-6 space-y-4">
        {data.publications.entries.map((pub, index) => (
          <li key={index} className="leading-relaxed">

            {/* Title + Date */}
            <div className="flex justify-between items-start">
              <span className="font-semibold text-[15px] text-gray-900">
                {pub.title || "Publication Title"}
              </span>
              {pub.date && (
                <span className="text-sm text-gray-700">
                  {pub.date}
                </span>
              )}
            </div>

            {/* Publisher */}
            {pub.publisher && (
              <div className="text-sm italic text-gray-800 mt-1">
                {pub.publisher}
              </div>
            )}

            {/* Description */}
            {pub.description && (
              <div
                className="prose prose-sm text-sm mt-2 leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: pub.description }}
              />
            )}
          </li>
        ))}
      </ul>
    ))
  }
</section>
)}

{data?.organizations?.isVisible && (
    <section className="mb-8">
  <h2 className="text-xl font-bold border-b border-gray-700 pb-1 mb-4">
    Organizations
  </h2>

  {data.organizations.isVisible &&
    (data.organizations.entries.length === 0 ||
    data.organizations.entries.every(org => !org.orgName) ? (
      <p className="text-gray-600 text-sm italic">
        No organizations added.
      </p>
    ) : (
      <ul className="list-disc pl-6 space-y-4">
        {data.organizations.entries.map((org, index) => (
          <li key={index} className="leading-relaxed">

            {/* Organization Name + Dates */}
            <div className="flex justify-between items-start">
              <span className="font-semibold text-[15px] text-gray-900">
                {org.orgName || "Organization Name"}
              </span>

              {(org.startDate || org.endDate) && (
                <span className="text-sm text-gray-700">
                  {org.startDate ? org.startDate : ""}{" "}
                  {org.startDate && org.endDate ? "–" : ""}
                  {org.endDate ? org.endDate : ""}
                </span>
              )}
            </div>

            {/* Position / Role */}
            {org.position && (
              <div className="text-sm italic text-gray-800 mt-1">
                {org.position}
              </div>
            )}

            {/* Description */}
            {org.description && (
              <div
                className="prose prose-sm text-sm mt-2 leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: org.description }}
              />
            )}
          </li>
        ))}
      </ul>
    ))
  }
</section>
)}






    </div>
  );
}
