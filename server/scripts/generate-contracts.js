const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "..", "sample-contracts");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

function createPDF(filename, title, content) {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 60 });
        const stream = fs.createWriteStream(path.join(outputDir, filename));
        doc.pipe(stream);

        doc.fontSize(18).font("Helvetica-Bold").text(title, { align: "center" });
        doc.moveDown(2);
        doc.fontSize(10).font("Helvetica").text(content, { align: "left", lineGap: 4 });
        doc.end();
        stream.on("finish", resolve);
    });
}

// Contract 1: Employment Agreement (comprehensive)
const employment = `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into as of January 15, 2026, by and between TechNova Inc., a Delaware corporation with principal offices at 500 Innovation Drive, San Francisco, CA 94105 ("Employer"), and Sarah Chen, an individual residing at 1234 Oak Street, San Jose, CA 95112 ("Employee").

RECITALS
WHEREAS, Employer desires to employ Employee as a Senior Software Engineer, and Employee desires to accept such employment, subject to the terms and conditions set forth herein.

NOW, THEREFORE, in consideration of the mutual covenants and agreements hereinafter set forth and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. POSITION AND DUTIES
1.1 Employee shall serve as Senior Software Engineer, reporting directly to the VP of Engineering.
1.2 Employee's primary responsibilities shall include: (a) designing and developing scalable software systems, (b) mentoring junior engineers, (c) participating in architectural reviews, and (d) contributing to technical roadmap planning.
1.3 Employee shall devote full working time and best efforts to the performance of duties hereunder.
1.4 Employee agrees to comply with all company policies, procedures, and codes of conduct as may be amended from time to time.

2. COMPENSATION AND BENEFITS
2.1 Base Salary: Employee shall receive an annual base salary of $185,000, payable in accordance with Employer's standard payroll schedule, less applicable withholdings and deductions.
2.2 Signing Bonus: Employee shall receive a one-time signing bonus of $25,000, payable within thirty (30) days of the Start Date, subject to a pro-rata clawback provision if Employee voluntarily terminates employment within twelve (12) months.
2.3 Annual Performance Bonus: Employee shall be eligible for an annual performance bonus of up to 20% of base salary, based on individual performance metrics and company performance, as determined by Employer in its sole discretion.
2.4 Equity Compensation: Employee shall be granted 10,000 stock options under the Company's 2025 Equity Incentive Plan, subject to a four-year vesting schedule with a one-year cliff. Exercise price shall be the fair market value on the grant date.
2.5 Benefits: Employee shall be entitled to participate in all employee benefit programs, including: (a) comprehensive health, dental, and vision insurance, (b) 401(k) retirement plan with 4% employer match, (c) 20 days of paid time off per year, (d) 10 paid company holidays, (e) $5,000 annual professional development budget, and (f) remote work flexibility of up to 2 days per week.
2.6 Relocation Assistance: Employer shall provide up to $15,000 in relocation expenses if Employee relocates within 90 days of the Start Date.

3. TERM AND TERMINATION
3.1 Employment Period: This Agreement shall commence on February 1, 2026 ("Start Date") and shall continue for an indefinite period unless terminated in accordance with this Section 3.
3.2 At-Will Employment: Notwithstanding any other provision of this Agreement, Employee's employment is "at-will" and may be terminated by either party at any time, with or without cause, and with or without notice.
3.3 Termination Without Cause: If Employer terminates Employee's employment without Cause, Employee shall be entitled to: (a) six (6) months of base salary continuation, (b) acceleration of next vesting tranche of equity, and (c) COBRA health insurance coverage for six (6) months at Employer's expense.
3.4 Termination for Cause: Employer may terminate Employee's employment immediately for Cause. "Cause" includes: (a) material breach of this Agreement, (b) conviction of a felony, (c) willful misconduct, (d) continued failure to perform duties after written notice, or (e) violation of Employer's policies causing material harm.
3.5 Resignation: Employee may resign at any time with thirty (30) days' written notice. Failure to provide adequate notice may result in forfeiture of unused PTO payout.

4. INTELLECTUAL PROPERTY AND INVENTIONS
4.1 All inventions, works of authorship, developments, improvements, and trade secrets conceived, developed, or reduced to practice by Employee during the term of employment shall be the sole and exclusive property of Employer ("Work Product").
4.2 Employee hereby assigns to Employer all right, title, and interest in and to any Work Product.
4.3 Employee agrees to assist Employer in obtaining patents, copyrights, or other protections for any Work Product, at Employer's expense.
4.4 This Section does not apply to inventions developed entirely on Employee's own time without use of Employer's resources, provided such inventions do not relate to Employer's current or anticipated business.

5. CONFIDENTIALITY AND NON-DISCLOSURE
5.1 Employee acknowledges that during employment, Employee will have access to confidential and proprietary information ("Confidential Information"), including but not limited to: trade secrets, customer lists, financial data, product plans, source code, algorithms, and business strategies.
5.2 Employee agrees not to use or disclose Confidential Information during or after employment, except as required in the performance of duties.
5.3 This confidentiality obligation shall survive termination of employment for a period of five (5) years.

6. NON-COMPETE AND NON-SOLICITATION
6.1 Non-Compete: During employment and for twelve (12) months following termination, Employee shall not engage in, or assist any person or entity engaged in, any business that competes with Employer's business within a fifty (50) mile radius of any Employer office or in any market where Employer conducts business.
6.2 Non-Solicitation of Employees: For twenty-four (24) months following termination, Employee shall not directly or indirectly solicit, recruit, or hire any employee of Employer.
6.3 Non-Solicitation of Clients: For eighteen (18) months following termination, Employee shall not solicit or service any client or customer of Employer with whom Employee had contact during the last twelve (12) months of employment.

7. PERFORMANCE METRICS AND REVIEW
7.1 Employee's performance shall be evaluated annually based on the following key performance indicators (KPIs): (a) code quality and review metrics, (b) project delivery timelines, (c) mentorship and team development, (d) innovation and technical contribution, and (e) customer satisfaction metrics for products developed.
7.2 Performance reviews shall be conducted within the first 90 days (probationary review) and annually thereafter.
7.3 Failure to meet minimum performance standards after two consecutive review periods may constitute grounds for termination under Section 3.4.

8. DISPUTE RESOLUTION
8.1 Any dispute arising out of or relating to this Agreement shall be resolved through binding arbitration administered by the American Arbitration Association in San Francisco, California.
8.2 Each party shall bear its own costs and attorneys' fees in any arbitration proceeding.
8.3 The arbitrator's decision shall be final and binding, and judgment may be entered in any court of competent jurisdiction.

9. MISCELLANEOUS
9.1 Governing Law: This Agreement shall be governed by the laws of the State of California.
9.2 Entire Agreement: This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements.
9.3 Amendment: This Agreement may only be amended in writing signed by both parties.
9.4 Severability: If any provision is held invalid, the remaining provisions shall remain in full force and effect.
9.5 Notices: All notices shall be in writing and delivered to the addresses set forth above.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

EMPLOYER: TechNova Inc.
By: __________________________ Date: __________
Name: James Morrison
Title: CEO

EMPLOYEE:
By: __________________________ Date: __________
Name: Sarah Chen`;

// Contract 2: Commercial Lease Agreement
const lease = `COMMERCIAL LEASE AGREEMENT

This Commercial Lease Agreement ("Lease") is entered into effective March 1, 2026, by and between Meridian Properties LLC, a California limited liability company ("Landlord"), and CloudScale Solutions Inc., a Delaware corporation ("Tenant").

PREMISES
Landlord hereby leases to Tenant, and Tenant hereby leases from Landlord, the following described premises: Suite 400, located at 2500 Market Street, San Francisco, CA 94114, consisting of approximately 4,500 square feet of rentable office space ("Premises"), together with non-exclusive use of common areas including lobbies, restrooms, elevators, parking garage, and loading dock.

1. TERM
1.1 Initial Term: The initial term of this Lease shall be sixty (60) months, commencing on March 1, 2026, and expiring on February 28, 2031 ("Initial Term").
1.2 Renewal Option: Tenant shall have two (2) consecutive options to renew this Lease for additional periods of thirty-six (36) months each, upon written notice given not less than one hundred eighty (180) days prior to expiration, subject to market rate adjustment.
1.3 Early Termination: Tenant may terminate this Lease after the thirty-sixth (36th) month by providing one hundred twenty (120) days' written notice and paying an early termination fee equal to four (4) months' Base Rent.

2. RENT AND FINANCIAL TERMS
2.1 Base Rent: Tenant shall pay monthly Base Rent as follows:
    Months 1-2: $0 (Free Rent Period)
    Months 3-12: $22,500 per month ($60.00 per square foot per annum)
    Months 13-24: $23,175 per month (3% annual escalation)
    Months 25-36: $23,870 per month
    Months 37-48: $24,586 per month
    Months 49-60: $25,324 per month
2.2 Security Deposit: Tenant shall deposit $67,500 (equivalent to three months' Base Rent) with Landlord upon execution of this Lease. Deposit shall be returned within thirty (30) days of Lease termination, less any amounts owed.
2.3 Operating Expenses: Tenant shall pay its proportionate share (estimated at 15.2%) of Building Operating Expenses, including property taxes, insurance, maintenance, janitorial services, and common area utilities. Base Year for Operating Expense calculations shall be calendar year 2026.
2.4 Utilities: Tenant shall be responsible for all utilities serving the Premises, including electricity, gas, water, sewer, internet, and telecommunications.
2.5 Late Payment: Rent not received within five (5) days of the due date shall incur a late fee of 5% of the overdue amount, plus interest at 1.5% per month.
2.6 Tenant Improvement Allowance: Landlord shall provide a Tenant Improvement Allowance of $45 per rentable square foot ($202,500 total) for initial build-out. Any costs exceeding this amount shall be Tenant's responsibility. Unused allowance shall not be converted to rent credit.

3. USE AND OPERATIONS
3.1 Permitted Use: The Premises shall be used exclusively for general office purposes, software development, and activities incidental thereto.
3.2 Prohibited Uses: Tenant shall not use the Premises for: (a) any unlawful purpose, (b) storage of hazardous materials, (c) manufacturing or industrial operations, (d) retail sales to the general public, or (e) any purpose that increases the insurance premium for the Building.
3.3 Hours of Operation: Tenant shall have access to the Premises 24 hours a day, 7 days a week. Building HVAC services are provided Monday through Friday, 8:00 AM to 6:00 PM, and Saturday 9:00 AM to 1:00 PM. After-hours HVAC is available at $75 per hour.
3.4 Parking: Landlord shall provide Tenant with twelve (12) unreserved parking spaces at $250 per space per month, subject to 3% annual increases. Four (4) additional reserved spaces are available at $400 per space per month.

4. MAINTENANCE AND REPAIRS
4.1 Landlord Responsibilities: Landlord shall maintain the structural elements of the Building, including roof, exterior walls, foundation, common area HVAC systems, elevators, and fire safety systems.
4.2 Tenant Responsibilities: Tenant shall maintain the interior of the Premises in good condition, including flooring, paint, fixtures, appliances, and Tenant's equipment. Tenant shall be responsible for any damage to the Premises caused by Tenant, its employees, agents, or invitees.
4.3 HVAC Maintenance: Tenant shall maintain a preventive maintenance contract for the HVAC unit(s) serving the Premises, at Tenant's expense, with a licensed contractor approved by Landlord.
4.4 Emergency Repairs: In the event of an emergency requiring immediate repair, Landlord may enter the Premises without notice to perform necessary repairs, and Tenant shall reimburse Landlord for the cost of any repairs attributable to Tenant's negligence.

5. INSURANCE
5.1 Tenant Insurance: Tenant shall maintain at all times: (a) Commercial General Liability insurance with limits of not less than $2,000,000 per occurrence and $5,000,000 aggregate, (b) Property Insurance covering Tenant's personal property, improvements, and betterments, (c) Workers' Compensation insurance as required by law, (d) Business Interruption insurance covering at least twelve (12) months of rent and operating expenses, and (e) Cyber Liability insurance with limits of $1,000,000.
5.2 Landlord as Additional Insured: Tenant shall name Landlord as additional insured on all liability policies.
5.3 Waiver of Subrogation: Both parties waive rights of subrogation against each other.

6. ASSIGNMENT AND SUBLETTING
6.1 Tenant shall not assign this Lease or sublet all or any portion of the Premises without Landlord's prior written consent, which shall not be unreasonably withheld.
6.2 Any permitted assignment or sublease shall not release Tenant from its obligations under this Lease.
6.3 Landlord shall receive 50% of any sublease profit (sublease rent minus Tenant's per-square-foot cost).

7. DEFAULT AND REMEDIES
7.1 Tenant Default: The following events shall constitute a default by Tenant: (a) failure to pay rent within ten (10) days after written notice, (b) failure to perform any other Lease obligation within thirty (30) days after written notice, (c) Tenant's bankruptcy or insolvency, or (d) abandonment of the Premises.
7.2 Landlord Remedies: Upon Tenant default, Landlord may: (a) terminate this Lease and recover damages, (b) re-enter and take possession of the Premises, (c) relet the Premises and hold Tenant liable for any deficiency, or (d) pursue any other remedy available at law or equity.
7.3 Landlord Default: If Landlord fails to perform any obligation within thirty (30) days of written notice (or such longer period as reasonably required), Tenant may: (a) perform the obligation and deduct the cost from rent, or (b) terminate this Lease if the default materially affects Tenant's use of the Premises.

8. INDEMNIFICATION AND LIABILITY
8.1 Tenant Indemnification: Tenant shall indemnify, defend, and hold harmless Landlord from any claims, damages, costs, or expenses arising from Tenant's use of the Premises, Tenant's breach of this Lease, or the negligence of Tenant or its agents.
8.2 Landlord Indemnification: Landlord shall indemnify Tenant from claims arising from Landlord's negligence or breach of this Lease.
8.3 Limitation of Liability: In no event shall either party be liable for consequential, incidental, or punitive damages.

9. ENVIRONMENTAL COMPLIANCE
9.1 Tenant shall comply with all federal, state, and local environmental laws and regulations.
9.2 Tenant shall not generate, store, treat, or dispose of any Hazardous Materials in or about the Premises, except for ordinary office supplies in de minimis quantities.
9.3 Tenant shall immediately notify Landlord of any environmental contamination or violation related to the Premises.

10. MISCELLANEOUS
10.1 Governing Law: This Lease shall be governed by California law.
10.2 Notices: All notices shall be in writing and delivered personally, by certified mail, or by overnight courier to the addresses specified herein.
10.3 Force Majeure: Neither party shall be liable for delays caused by events beyond reasonable control, including natural disasters, pandemics, government orders, or labor disputes.
10.4 ADA Compliance: Landlord represents that the Building common areas comply with the Americans with Disabilities Act. Tenant shall be responsible for ADA compliance within the Premises.

IN WITNESS WHEREOF, the parties have executed this Lease as of the date first set forth above.

LANDLORD: Meridian Properties LLC
By: __________________________ Date: __________
Name: Robert Williams
Title: Managing Member

TENANT: CloudScale Solutions Inc.
By: __________________________ Date: __________
Name: Lisa Park
Title: Chief Operating Officer`;

// Contract 3: SaaS Services Agreement
const saas = `SOFTWARE AS A SERVICE (SaaS) AGREEMENT

This Software as a Service Agreement ("Agreement") is entered into as of February 1, 2026, by and between DataStream Analytics Inc., a Delaware corporation with principal offices at 800 Technology Parkway, Austin, TX 78701 ("Provider"), and GlobalRetail Corp., a New York corporation ("Client").

RECITALS
Provider offers a cloud-based business intelligence and analytics platform ("Platform"), and Client desires to subscribe to the Platform subject to the terms and conditions set forth herein.

1. DEFINITIONS
1.1 "Authorized Users" means Client's employees, contractors, and agents who are authorized to access and use the Platform under this Agreement.
1.2 "Client Data" means all data, information, and content uploaded, submitted, or generated by Client or its Authorized Users through the Platform.
1.3 "Documentation" means the user guides, technical manuals, and online help resources provided by Provider for the Platform.
1.4 "Service Level Agreement" or "SLA" means the service availability and performance guarantees set forth in Exhibit A.
1.5 "Subscription Term" means the period during which Client has access to the Platform as specified in the Order Form.

2. SUBSCRIPTION AND ACCESS
2.1 Grant of License: Subject to the terms of this Agreement, Provider grants Client a non-exclusive, non-transferable, limited right to access and use the Platform during the Subscription Term for Client's internal business purposes.
2.2 Authorized Users: Client may designate up to 250 Authorized Users during the Initial Term. Additional users may be added at $50 per user per month, prorated for the remaining Subscription Term.
2.3 Usage Limits: The subscription includes: (a) up to 500 GB of data storage, (b) unlimited dashboard creation, (c) 10,000 API calls per day, (d) real-time data processing up to 100 concurrent streams, and (e) automated report generation (up to 500 reports per month).
2.4 Platform Availability: Provider shall make the Platform available 99.9% of the time during each calendar month, excluding scheduled maintenance windows (Saturdays 2:00 AM - 6:00 AM ET).

3. FEES AND PAYMENT
3.1 Subscription Fees: Client shall pay an annual subscription fee of $180,000, payable in equal monthly installments of $15,000.
3.2 Implementation Fees: A one-time implementation and onboarding fee of $35,000 shall be due upon execution of this Agreement, covering data migration, custom dashboard configuration, API integration setup, and training for up to 20 users.
3.3 Overage Charges: Usage exceeding the limits set forth in Section 2.3 shall be billed at the following rates: (a) Additional storage: $0.15 per GB per month, (b) Additional API calls: $0.005 per call, (c) Additional report generation: $2 per report.
3.4 Annual Increase: Subscription fees shall increase by no more than 5% per year upon renewal.
3.5 Payment Terms: All invoices are due within thirty (30) days of invoice date. Late payments shall incur interest at 1.5% per month. Provider may suspend access if payment is more than fifteen (15) days overdue after written notice.

4. DATA OWNERSHIP AND PRIVACY
4.1 Client Data Ownership: Client retains all right, title, and interest in and to Client Data. Provider acquires no ownership rights in Client Data.
4.2 Data Processing: Provider shall process Client Data solely for the purpose of providing the Platform services and as directed by Client. Provider shall not use Client Data for any other purpose, including advertising, analytics for third parties, or training machine learning models.
4.3 Data Privacy Compliance: Provider shall comply with all applicable data protection laws, including GDPR, CCPA, and any other applicable privacy regulations. Provider shall maintain appropriate technical and organizational measures to protect Client Data.
4.4 Data Location: Client Data shall be stored and processed exclusively within the United States and the European Union, unless otherwise agreed in writing.
4.5 Data Portability: Upon request, Provider shall export Client Data in industry-standard formats (CSV, JSON, Parquet) within five (5) business days.
4.6 Data Retention and Deletion: Upon termination of this Agreement, Provider shall retain Client Data for a period of ninety (90) days, during which Client may request export. After ninety (90) days, Provider shall permanently delete all Client Data and certify such deletion in writing.
4.7 Sub-Processors: Provider shall maintain a list of sub-processors and notify Client at least thirty (30) days before engaging any new sub-processor. Client may object to any new sub-processor on reasonable grounds.

5. SECURITY
5.1 Security Standards: Provider shall maintain information security practices consistent with SOC 2 Type II certification, ISO 27001, and NIST Cybersecurity Framework.
5.2 Encryption: All Client Data shall be encrypted at rest (AES-256) and in transit (TLS 1.3).
5.3 Access Controls: Provider shall implement role-based access controls, multi-factor authentication, and detailed audit logging for all access to Client Data.
5.4 Security Audits: Client may conduct or commission a security audit of Provider's systems and practices once per calendar year, upon thirty (30) days' written notice, at Client's expense.
5.5 Breach Notification: In the event of a security breach affecting Client Data, Provider shall: (a) notify Client within twenty-four (24) hours of discovery, (b) provide a detailed incident report within seventy-two (72) hours, (c) cooperate fully with Client's investigation, and (d) take all reasonable steps to mitigate the breach and prevent recurrence.
5.6 Vulnerability Management: Provider shall maintain a vulnerability management program including regular penetration testing (at least quarterly) and timely patching of known vulnerabilities (critical vulnerabilities within 48 hours).

6. SERVICE LEVELS AND SUPPORT
6.1 Uptime Guarantee: Provider guarantees 99.9% uptime availability per calendar month.
6.2 SLA Credits: If uptime falls below the guaranteed level, Client shall receive service credits as follows:
    99.0% - 99.9%: 10% credit of monthly fees
    95.0% - 98.99%: 25% credit of monthly fees
    Below 95.0%: 50% credit of monthly fees
6.3 Maximum Credits: Total SLA credits shall not exceed 50% of monthly fees in any given month.
6.4 Support Tiers:
    Standard Support: Email support with 24-hour response time, available Monday-Friday 8 AM-6 PM ET.
    Priority Support (included): Phone and email support with 4-hour response time for critical issues, available 24/7.
    Dedicated Account Manager: Assigned account manager with quarterly business reviews.
6.5 Maintenance: Scheduled maintenance windows shall be communicated at least five (5) business days in advance. Emergency maintenance may be performed without advance notice.

7. INTELLECTUAL PROPERTY
7.1 Provider IP: Provider retains all right, title, and interest in and to the Platform, including all software, algorithms, user interfaces, documentation, and related intellectual property.
7.2 Feedback: If Client provides suggestions, feedback, or ideas regarding the Platform, Provider may use such feedback without restriction or obligation to Client.
7.3 Client IP: Nothing in this Agreement grants Provider any rights to Client's trademarks, trade names, or other intellectual property.

8. WARRANTIES AND DISCLAIMERS
8.1 Provider Warranties: Provider warrants that: (a) the Platform will perform materially in accordance with the Documentation, (b) Provider has the right to enter into this Agreement, (c) the Platform will not infringe any third-party intellectual property rights, and (d) Provider will comply with all applicable laws.
8.2 Disclaimer: EXCEPT AS EXPRESSLY SET FORTH HEREIN, THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. PROVIDER DISCLAIMS ALL IMPLIED WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

9. LIMITATION OF LIABILITY
9.1 NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO THIS AGREEMENT.
9.2 PROVIDER'S TOTAL AGGREGATE LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID BY CLIENT IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
9.3 The foregoing limitations shall not apply to: (a) Provider's indemnification obligations, (b) breaches of confidentiality or data privacy obligations, or (c) willful misconduct.

10. TERM AND TERMINATION
10.1 Initial Term: This Agreement shall have an initial term of thirty-six (36) months commencing on February 1, 2026.
10.2 Renewal: This Agreement shall automatically renew for successive twelve (12) month periods unless either party provides written notice of non-renewal at least ninety (90) days prior to the end of the then-current term.
10.3 Termination for Cause: Either party may terminate this Agreement upon written notice if the other party: (a) materially breaches this Agreement and fails to cure within thirty (30) days, or (b) becomes insolvent, files for bankruptcy, or ceases operations.
10.4 Termination for Convenience: Client may terminate this Agreement for convenience after the Initial Term upon sixty (60) days' written notice. Early termination during the Initial Term requires payment of 50% of remaining subscription fees.
10.5 Effect of Termination: Upon termination, Client's access to the Platform shall cease, and the provisions of Sections 4.6 (Data Retention), 5 (Security), 7 (IP), 8 (Warranties), 9 (Limitation of Liability), and 11 (Confidentiality) shall survive.

11. CONFIDENTIALITY
11.1 Both parties shall maintain the confidentiality of all non-public information received from the other party during the term of this Agreement.
11.2 Confidential Information shall not include information that: (a) is publicly available, (b) was known to the receiving party before disclosure, (c) is independently developed by the receiving party, or (d) is disclosed with the prior written consent of the disclosing party.
11.3 Confidentiality obligations shall survive termination for three (3) years.

12. INDEMNIFICATION
12.1 Provider Indemnification: Provider shall indemnify, defend, and hold harmless Client from any third-party claims arising from: (a) infringement of intellectual property rights by the Platform, (b) violation of applicable laws by Provider, or (c) breach of data privacy obligations.
12.2 Client Indemnification: Client shall indemnify Provider from third-party claims arising from: (a) Client's use of the Platform in violation of this Agreement, or (b) Client Data that infringes third-party rights.

13. MISCELLANEOUS
13.1 Governing Law: This Agreement shall be governed by the laws of the State of Texas.
13.2 Dispute Resolution: Disputes shall first be submitted to good faith mediation. If unresolved within sixty (60) days, disputes shall be submitted to binding arbitration in Austin, Texas.
13.3 Force Majeure: Neither party shall be liable for delays or failures due to circumstances beyond their reasonable control.
13.4 Entire Agreement: This Agreement, together with all exhibits and order forms, constitutes the entire agreement between the parties.
13.5 Notices: All notices shall be in writing and delivered to the addresses specified in the Order Form.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first set forth above.

PROVIDER: DataStream Analytics Inc.
By: __________________________ Date: __________
Name: Michael Torres
Title: Chief Revenue Officer

CLIENT: GlobalRetail Corp.
By: __________________________ Date: __________
Name: Amanda Reynolds
Title: VP of Business Intelligence`;

async function main() {
    await createPDF("Employment_Agreement_Senior_Engineer.pdf", "EMPLOYMENT AGREEMENT", employment);
    console.log("Created: Employment_Agreement_Senior_Engineer.pdf");

    await createPDF("Commercial_Lease_Agreement.pdf", "COMMERCIAL LEASE AGREEMENT", lease);
    console.log("Created: Commercial_Lease_Agreement.pdf");

    await createPDF("SaaS_Services_Agreement.pdf", "SaaS SERVICES AGREEMENT", saas);
    console.log("Created: SaaS_Services_Agreement.pdf");

    console.log("\nAll contracts created in:", outputDir);
}

main();
