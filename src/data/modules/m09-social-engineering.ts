import type { Module } from '../cehModules';

export const m09: Module = {
  id: 'm09',
  number: 'M09',
  title: 'Social Engineering',
  description: 'Master the psychological art of human manipulation. The weakest link in any security architecture is always the human element. Learn the phases of social engineering attacks, from OSINT gathering to pretexting, payload delivery, and exploitation. Analyze advanced attack vectors including spear-phishing, deepfake vishing, physical breaches, USB baiting, and insider threats.',
  examWeight: '5%',
  estimatedQuestions: 6,
  duration: '3h 30m',
  topics: [
    {
      id: 'm09-t01',
      title: 'Psychology of Manipulation',
      content: 'Social engineering exploits cognitive biases and human behavioral traits rather than technical software vulnerabilities. Attackers rely on psychological triggers to bypass critical thinking and compel targets to take actions that compromise security.',
      keyPoints: [
        'Authority: Impersonating executives, IT support, or law enforcement to demand compliance without question (e.g., "I am the VP of Finance, wire this money immediately").',
        'Urgency/Scarcity: Forcing hasty decisions by imposing false deadlines ("Your account will be permanently suspended in 2 hours if you do not click here").',
        'Familiarity/Liking: Building rapport and trust over time before asking for favors or sensitive information.',
        'Reciprocation: Providing a small favor (e.g., "fixing" a non-existent IT issue) to compel the victim to return the favor (e.g., providing their password for "verification").',
        'Social Proof: Convincing the target that "everyone else in the department has already updated their credentials," validating the requested action.',
      ],
    },
    {
      id: 'm09-t02',
      title: 'Digital Vectors (Phishing & Frameworks)',
      content: 'Digital social engineering scales easily and is the primary initial access vector for most modern cyberattacks (including ransomware). Phishing involves sending fraudulent communications that appear to come from a reputable source.',
      commands: [
        { command: 'gophish', description: 'Launch the Gophish framework to deploy enterprise-grade simulated phishing campaigns and track open/click rates' },
        { command: 'setoolkit', description: 'Social-Engineer Toolkit: Automate spear-phishing, credential harvesting (cloning websites), and payload delivery' },
        { command: 'evilginx2', description: 'Advanced MitM phishing framework capable of bypassing Multi-Factor Authentication (MFA) by stealing session cookies' },
      ],
      keyPoints: [
        'Phishing: Mass-emailed, generic lures ("Reset your bank password"). Casts a wide net.',
        'Spear-Phishing: Highly targeted attacks against specific individuals, utilizing OSINT (LinkedIn, Twitter) to craft personalized, highly convincing lures.',
        'Whaling: Spear-phishing specifically targeting C-level executives (CEOs, CFOs) due to their high-level access and financial authority.',
        'Vishing (Voice Phishing): Using phone calls, often combined with caller ID spoofing and AI Deepfake audio, to extract information or force password resets.',
        'Smishing (SMS Phishing): Sending malicious links via text messages, exploiting the inherent trust people place in mobile communications.',
        'Business Email Compromise (BEC): Compromising a legitimate corporate email account to authorize fraudulent wire transfers or extract data from partners. Extremely lucrative.',
      ],
    },
    {
      id: 'm09-t03',
      title: 'Physical & In-Person Vectors',
      content: 'Physical social engineering involves bypassing physical security controls to gain unauthorized access to a facility. Once inside, attackers can deploy hardware keyloggers, network taps (e.g., LAN Turtle), or access unlocked terminals.',
      keyPoints: [
        'Tailgating: Following an authorized person through a secure door without authenticating, and WITHOUT their knowledge or consent.',
        'Piggybacking: Following an authorized person through a secure door WITH their consent (e.g., carrying heavy boxes and asking "Can you hold the door? I forgot my badge").',
        'Shoulder Surfing: Observing a target entering credentials or viewing sensitive data on their screen (e.g., on an airplane or at a coffee shop).',
        'Dumpster Diving: Searching through corporate trash for discarded documents containing sensitive information, organizational charts, or hardware. Considered a reconnaissance technique.',
        'Baiting: Leaving malware-infected physical media (e.g., Rubber Ducky USB drives labeled "Q4 Layoffs" or "Executive Salaries") in public areas, relying on human curiosity.',
        'Impersonation: Posing as a delivery driver, HVAC technician, or fire inspector to bypass reception and gain unescorted access to the building.',
      ],
    },
    {
      id: 'm09-t04',
      title: 'Insider Threats',
      content: 'Not all attacks come from the outside. Insider threats involve individuals with authorized access to an organization\'s systems intentionally or unintentionally compromising security. They are exceptionally difficult to detect because the attacker already bypassed external perimeter defenses.',
      keyPoints: [
        'Malicious Insider: A disgruntled employee or contractor intentionally stealing data, sabotaging systems (logic bombs), or selling access to external actors.',
        'Negligent Insider: An employee who inadvertently causes a breach through carelessness, such as falling for a phishing email, ignoring security warnings, or misconfiguring an S3 bucket.',
        'Compromised Insider: An employee whose credentials have been stolen by an external attacker. The attack appears as legitimate internal activity.',
        'Indicators of Insider Threat: Unusual data downloads (exfiltration), accessing systems outside normal working hours, sudden changes in behavior, or financial distress.',
      ],
    },
  ],
  keyTools: ['Social-Engineer Toolkit (SET)', 'Gophish', 'Evilginx2', 'Maltego', 'theHarvester', 'O.MG Cable / Rubber Ducky'],
  countermeasures: [
    'Implement a comprehensive, mandatory Security Awareness Training program with regular, simulated phishing campaigns to inoculate users.',
    'Enforce Multi-Factor Authentication (MFA) globally. Consider hardware security keys (YubiKey/FIDO2) to mitigate advanced MitM phishing (Evilginx2).',
    'Establish strict verification protocols for financial transactions or sensitive data requests (e.g., require out-of-band phone verification for any wire transfer over $10,000).',
    'Deploy physical security controls: mantrap doors, security guards, clear desk policies, and secure shredding for all documents.',
    'Implement the Principle of Least Privilege and robust User and Entity Behavior Analytics (UEBA) to detect and contain insider threats.',
  ],
  examTips: [
    'Tailgating implies the authorized user is UNAWARE. Piggybacking implies the authorized user KNOWS and ALLOWS it.',
    'Spear-phishing targets specific people; Whaling targets specifically HIGH-LEVEL executives.',
    'Vishing uses Voice (phone); Smishing uses SMS (text).',
    'Dumpster diving is considered a pre-attack (reconnaissance/footprinting) activity used to gather OSINT.',
    'The Social-Engineer Toolkit (SET) is the primary tool referenced for automating social engineering attacks on the CEH exam.',
  ],
  realWorldScenarios: [
    'A penetration tester calls the corporate helpdesk, posing as the new CFO who is traveling and locked out of their account. By leveraging urgency and authority, the helpdesk resets the password over the phone, granting the tester full network access.',
    'An attacker drops 10 USB drives in the company parking lot. A curious employee plugs one in, triggering an auto-running HID payload (Hak5 Rubber Ducky) that executes PowerShell and drops a reverse shell, completely bypassing the external firewall.',
    'Using information gathered from LinkedIn, an attacker sends a highly targeted spear-phishing email to the HR department masquerading as a job applicant. The attached PDF resume contains an exploit that compromises the HR representative\'s machine.',
    'Attackers clone a corporate Office 365 login page using Evilginx2 and send the link via SMS to employees (Smishing). When employees log in, Evilginx2 proxies the request to Microsoft, captures the valid session cookie, and bypasses the SMS MFA requirement.',
  ],
  prerequisites: ['M02 — Footprinting and OSINT provide the intelligence necessary to craft convincing pretexts and targeted phishing lures.'],
};
