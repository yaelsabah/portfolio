// One place for every project. Both pages read from this list.
// Order here = order on the home page and in previous/next.
// Text in [brackets] is placeholder copy to replace.
window.PROJECTS = [
  {
    slug: 'life-tribute',
    name: 'Life Tribute',
    outcome: 'A platform that lets people turn a handful of old family photos into a moving, shareable tribute video of someone they love.',
    role: 'Product designer',
    industry: 'B2C',
    company: 'MyHeritage',
    year: '2026',
    video: 'assets/video/tribute-video.mp4',
    cardVideo: false,
    // cover image, also the poster shown until the video loads
    image: 'assets/images/life-tribute.jpg',
    // head image of the case study (laptop + phone from Figma, transparent background); when set it is used instead of the video
    hero: 'assets/images/life-tribute-hero.webp',
    // colour behind the transparent head image: the page background, so the devices sit straight on the page
    heroBg: 'var(--ground)',
    heroAlt: 'The Life Tribute landing page on a laptop and a phone, with a wedding photograph, the headline, a Create Life Tribute button and a row of small photographs',
    backdrop: 'assets/images/calendly-backdrop.jpg',
    alt: 'The Life Tribute landing page, with the headline, a Create Life Tribute button and a row of photographs',
    crops: ['24% 74%', '50% 30%'],
    mobileFocus: '50% 0%',
    chaptersTitle: false,
    team: false,
    // the survey numbers sit inside the research chapter (see its sections), so there is no separate Impact section
    impactSection: false,
    lead: 'Most people already have the photos. What they needed was a reason to trust turning them into a video of someone they love.',
    // Text in [brackets] is placeholder copy. media.row is a horizontal row of placeholders for recordings.
    chapters: [
      { title: 'The hypothesis',
        line: 'The moat: MyHeritage users can reach, collect and share old photos of family members.',
        lineAfter: true,
        body: ['MyHeritage users already keep their old family photos with us, and no one else starts with that. We saw the feature as a bridge between those photos and the fast-moving world of AI tools.',
               'We imagined a one-stop shop that takes care of old family photos: restoring them, colorizing and enhancing them, and eventually turning them into a shareable tribute video of a loved one.'],
        media: { src: 'assets/images/my-photos.jpg', alt: 'The My Photos page in MyHeritage, a gallery of old family photos, portraits and group pictures' } },
      { title: 'The research',
        line: 'Do people our users’ age really keep family photos, and can they reach them?',
        lineBelow: true,
        body: ['We surveyed 50 people in the age range of our users. The first question was whether they actually keep family photos on their computer and know how to find them. We got enough “yes” answers to keep going.',
               'The survey also asked about a video built from a loved one’s photos. Most people (60%) pictured a living relative and 40% pictured a memorial. Overall, 85% of the feedback was positive, and three findings stood out.'],
        // everything the research turned up sits under it, without a number of its own
        sections: [
          { title: 'What the survey showed',
            stats: [
              { number: '45%', text: 'of people thinking of a memorial said they would love it and use it, about twice said that they will use it for an event such as a birthday. Memorials matter most.' },
              { number: '64%', text: 'have more than five photos. Finding them is the hurdle, not having them: 32% call collecting them hard because they are physical prints.' },
              { number: '93%', text: 'of people who already knew the technology felt positive about it. Trust grows with familiarity.' }
            ] },
          { title: 'What people said when they imagined it',
            quotes: true,
            points: ['“To see a loved one who passed animated and looking alive again is beautiful and I would probably cry my eyes out.”',
                     '“It brings the memories to life... this will help bridge the gap of reliving it themselves and sharing it with me to carry on the legacy.”',
                     '“It’s frightening, I’m worried people will think it’s real.”'] },
          { title: 'Testing with Lyssna',
            body: ['Before the project started, we tested the basic UX, using a very lean experience we built with AI Studio.'],
            media: { row: { images: [
              { src: 'assets/images/lyssna-1.jpg', alt: 'A recorded usability test of the Life Tribute prototype: the first screen, with a Create tribute card and an example tribute, and the task instructions in a side panel' },
              { src: 'assets/images/lyssna-2.jpg', alt: 'A recorded usability test: a participant choosing photos from their computer in the file picker' },
              { src: 'assets/images/lyssna-3.jpg', alt: 'A recorded usability test: the Memory Collection screen with five of the participant’s photos added and the Generate Life Tribute video button ready' }
            ] } } },
          { title: 'What we took from it',
            boldLead: true,
            points: ['Lead with legacy. Frame the feature around preserving and honoring a life, because memorial moments are where it matters most.',
                     'Build trust before the first upload. Show what good results look like, and be clear about how the photos are used.',
                     'Make the photos easy to get. Start with the photos people already have in MyHeritage, and make adding more from a device simple.'] }
        ] },
      { title: 'The design',
        // the steps below belong to this chapter, so they sit under it without numbers of their own
        sections: [
          { bold: 'Life Tribute landing page.',
            line: 'It frames the feature around preserving and honoring a life.',
            media: { video: 'assets/video/lp-recording.mp4', frame: 'assets/images/laptop.png', full: true, alt: 'A screen recording of the Life Tribute landing page' } },
          { title: 'Starting with a person',
            body: ['The first screen asks whose Life Tribute it is. Suggested relatives come from the family tree, ordered by how close they are to the user and how many photos they have, each card showing a photo, the relationship and the life span.'],
            media: { src: 'assets/images/design-person-2x.webp', full: true, alt: 'The first step, Create a tribute video, with suggested relatives from the family tree shown as cards' } },
          { title: 'Sorting and styling',
            body: ['Photos sit in a row that can be dragged into order. The first is marked as the cover and the last as the closer, each with its own editable line of text.'],
            media: { full: true, row: { stack: true, images: [
              { src: 'assets/images/design-sort-1-2x.webp', alt: 'The sorting step, with the photos laid out in a grid to be dragged into order' },
              { src: 'assets/images/design-sort-2-2x.webp', alt: 'The sorting step with the Add cover text dialog open over the photos' }
            ] } } },
          { title: 'Choosing the photos',
            body: ['Photos where that relative is tagged come first, and users can select up to 15. A tip explains what makes a good set, from close-up smiles to group gatherings, with four examples on hover.'],
            media: { src: 'assets/images/design-photos-2x.webp', full: true, alt: 'The photo picker, with the relative’s tagged photos first and a tip about what makes a good set' } },
          { title: 'Setting the mood',
            body: ['The style step is a soundtrack, with a short preview on hover, and one checkbox: colorize and enhance the photos, on by default.'],
            media: { src: 'assets/images/design-mood-2x.webp', full: true, alt: 'The style step, with a list of soundtracks and a checkbox to colorize and enhance the photos' } },
          { title: 'Delivery and sharing',
            body: ['A video-ready page offers playback, download, sharing and a public link that works for guests without a MyHeritage account.'],
            media: { src: 'assets/images/design-share-2x.webp', full: true, alt: 'The video-ready page, with the finished tribute video and options to download and share it' } },
          { title: 'Mobile web',
            body: ['Many people keep a photo of each printed family picture on their phone, so their collection is already in their pocket. That makes the phone a natural place to create a Life Tribute, not only the computer.'],
            media: { phone: 'assets/images/design-mobile-device.png', video: 'assets/video/mobile-recording.mp4', src: 'assets/images/design-mobile.jpg', alt: 'The mobile web version of the Add cover text step, on a phone' } },
          { media: { full: true, phones: { frame: 'assets/images/design-mobile-device.png', screens: [
            { src: 'assets/images/design-m-1.jpg', alt: 'Mobile web screen 1 of 6' },
            { src: 'assets/images/design-m-2.jpg', alt: 'Mobile web screen 2 of 6' },
            { src: 'assets/images/design-m-3.jpg', alt: 'Mobile web screen 3 of 6: adding cover text' },
            { src: 'assets/images/design-m-4.jpg', alt: 'Mobile web screen 4 of 6' },
            { src: 'assets/images/design-m-5.jpg', alt: 'Mobile web screen 5 of 6' },
            { src: 'assets/images/design-m-6.jpg?v=2', alt: 'Mobile web screen 6 of 6' }
          ] } } }
        ] }
    ]
  },
  {
    slug: 'checklist',
    name: 'The Checklist',
    titleSize: 'clamp(56px, 7.6vw, 110px)',
    outcome: 'A guided checklist that shows new users what to do next, so they keep growing their family tree and reach their first valuable match.',
    role: 'Product designer',
    industry: 'B2C',
    company: 'MyHeritage',
    year: '2025',
    image: 'assets/images/checklist.webp',
    // the cover has a see-through background, so the card takes the page colour (light or dark)
    cardBg: 'var(--ground)',
    backdrop: 'assets/images/checklist-backdrop.jpg',
    alt: 'The Checklist panel in the MyHeritage family tree, with a progress bar and the next steps to take',
    crops: ['70% 30%', '70% 60%'],
    mobileFocus: '70% 0%',
    // the head image is the laptop composed in Figma (Hero frame), so it sits bare on the page ground
    hero: 'assets/images/checklist/hero-2x.webp',
    heroAspect: '1344 / 886',
    heroBg: 'var(--ground)',
    heroAlt: 'The MyHeritage family tree on a laptop, with the improved Checklist panel beside the tree',
    chaptersTitle: false,
    team: false,
    impactSection: false,
    lead: 'Only 3 in 10 people who finish onboarding go on to add another relative. The Checklist shows them what to do next.',
    // Story follows the Checklist case study in Figma (Case studies file, Case study / The Checklist – edited).
    chapters: [
      { title: 'MyHeritage’s core product',
        line: 'The family tree is where everything on MyHeritage starts.',
        lineBelow: true,
        body: ['MyHeritage is a family history platform that helps people discover where they come from. Anyone can build their own family tree on it, adding relatives and the details of their lives.',
               'The tree is the core of the product. MyHeritage looks for matches in its records and in other members’ trees, so the more relatives and facts people add, the more there is to find.'] },
      { title: 'The problem',
        line: 'People sign up to build a family tree, but most stop after the first few relatives.',
        lineBelow: true,
        body: ['New family tree users start with Magic 7, the onboarding flow where they add their first relatives. Half of the people who register never start it. Half of those who start never finish. And of those who finish, only about 30% go on to add anyone else on their own.',
               'That matters because matches are why people come back to MyHeritage, and matches are built from what users add. Fewer relatives and facts means fewer valuable matches, and without matches there is little reason to return.'],
        sections: [
          { title: 'The funnel',
            body: ['In the last 30 days, 391.4K people registered through the family tree. 197.4K started Magic 7, 98.1K finished it, and only 28.8K added a relative on their own afterwards.'],
            media: { src: 'assets/images/checklist/funnel-v2.png', wide: true, bare: true, alt: 'A bar chart of the family tree funnel over the last 30 days: 391.4K registered, 197.4K (50.43%) started Magic 7, 98.11K (25.07%) completed it, and 28.81K (7.36%) added an individual manually. Overall, 7.36% of registrants reach step 4.' } },
          { title: 'What the numbers say',
            stats: [
              { number: '50%', text: 'of users who start Magic 7 finish it. The other half never reach their first moment of value.' },
              { number: '30%', text: 'of users who finish Magic 7 go on to add relatives on their own.' },
              { number: '54%', text: 'of users who finish Magic 7 have fewer than 8 people in their tree.' }
            ] }
        ] },
      { title: 'The research',
        subGap: 80,
        line: 'We surveyed users who signed up and finished Magic 7 in the past two months, to learn why they stopped.',
        lineBelow: true,
        sections: [
          { title: 'In their own words',
            quotes: true,
            points: ['“I got stuck, I didn’t know how to continue.”',
                     '“I don’t know the exact names or details of additional relatives, and I wasn’t sure how to add them.”',
                     '“It felt overwhelming or complex”'] },
          { title: 'Key pain points',
            points: ['Unclear how matches are made, so it’s unclear why adding facts is worth it.',
                     'Hesitation to add incomplete details or living relatives.',
                     'Frustration with matches that come late, or not at all.'] }
        ] },
      { title: 'The hypothesis',
        line: 'If users get valuable matches early, they’ll add more to their tree, and a bigger tree brings even more matches. We called this loop the ‘Value Moments’ flywheel.',
        lineBelow: true,
        sections: [
          { media: { src: 'assets/images/checklist/flywheel-v2.webp', wide: true, bare: true,
                     alt: 'The Value Moments flywheel, a loop that compounds, in three steps. 1, Acquire data: help users easily add more data to their tree. 2, Compute: use the user’s data and MyHeritage data to create quality matches and other objects. 3, Utilize: help users use and benefit from MyHeritage data. MyHeritage’s matching engine handles Compute; our job was to move the two steps users own: Acquire and Utilize.' } },
          { title: 'Four ideas to get the wheel turning',
            boldLead: true,
            points: [{ text: 'Educate. Show users that the more they add, relatives and facts, the more valuable matches they get.', tag: 'Drives step 1 · Acquire data' },
                     { text: 'Teach. Show users how to add individuals and facts, so more of them do it.', tag: 'Drives step 1 · Acquire data' },
                     { text: 'Guide. Show users where their matches are and how Record Matches, Smart Matches and Instant Discoveries differ.', tag: 'Drives step 3 · Utilize' },
                     { text: 'Direct. Show users what to do next and how it leads to valuable matches.', tag: 'Closes the loop · back to step 1' }] }
        ] },
      { title: 'The Checklist: four principles that keep users moving',
        subGap: 55,
        sections: [
          { title: 'Little wins, from the first second',
            body: ['When users open the Checklist, they’ve already made progress. “Start your family tree” is checked off from Magic 7, so they start at 1/4, not zero, and a burst of confetti marks the win. The next task, adding relatives, continues what they were just doing, so the next check mark comes quickly.'],
            media: { video: 'assets/video/checklist/little-wins.mp4', src: 'assets/images/checklist/little-wins.jpg', wide: true, aspect: '2528 / 1366', alt: 'The MyHeritage family tree with the “Family tree checklist” entry point in the corner, at 0 of 4 steps' } },
          { title: 'Visible progress that pulls you forward',
            body: ['Every relative added earns a +1, and the step’s ring fills as users get closer. Each finished step turns green and fills a segment of the bar, and the closer users get to done, the stronger the pull to finish. Branch Builder™ adds many relatives in one click: a big jump for little effort.'],
            media: { video: 'assets/video/checklist/visible-progress.mp4', src: 'assets/images/checklist/visible-progress.jpg', wide: true, aspect: '2528 / 1366', alt: 'The family tree with the Checklist entry point showing 1 of 4 steps done and the first segment of the progress bar filled in green' } },
          { title: 'Certainty: always know what to do next',
            body: ['Each step has one clear action, and the “Family tree checklist” entry point stays in the tree so users can always come back to it. “What are matches?” opens a short explainer, and when nothing is ready yet, the Checklist says so honestly: “No matches found yet. Try adding a few more relatives, birth dates, or death dates.”'],
            media: { src: 'assets/images/checklist/matches-modals.png', wide: true, bare: true,
                     alt: 'Three explainer modals: What are Smart Matches™, What are Record Matches, and What are Instant Discoveries™, each with a short looping animation.',
                     overlays: [
                          { src: 'assets/images/checklist/modal-smart-matches.gif', x: 4.345, y: 42.884, w: 27.798, h: 26.248 },
                          { src: 'assets/images/checklist/modal-record-matches.gif', delay: 2000, x: 36.131, y: 42.884, w: 27.798, h: 26.248 },
                          { src: 'assets/images/checklist/modal-instant-discoveries.gif', x: 67.917, y: 43.438, w: 27.798, h: 26.248 }
                     ] } },
          { title: 'Incentive: a clear reward at the end',
            body: ['The header names both the user and the reward: “Laura, complete these steps to increase your chances of receiving discoveries.” The last step waits until there’s something to show, then unlocks with a “12 matches found” badge and a glowing Review button. And as the tree grows, an “Excellent!” moment celebrates the progress and invites users to keep going.'],
            media: { row: { stack: true, natural: true, images: [
              { video: 'assets/video/checklist/incentive-checklist.mp4', src: 'assets/images/checklist/incentive-checklist.jpg', alt: 'The open Checklist: “Laura, complete these steps to increase your chances of receiving discoveries”, 3 of 4 steps completed, with Review your matches still waiting for matches' },
              { video: 'assets/video/checklist/incentive-tree.mp4', src: 'assets/images/checklist/incentive-tree.jpg', alt: 'The family tree grown to 14 people across four generations' }
            ] } } },
          { title: 'What we expected',
            boldLead: true,
            points: ['Proactivity. More users reach activation by getting familiar with the product and actively growing their tree.',
                     'Perceived value. Users see tangible benefits earlier, which drives higher conversion.',
                     'Retention. Stronger retention at key milestones (day 7, day 14 and day 30), with sustained engagement and habit-building.'] }
        ] },
      { title: 'The A/B test',
        line: 'Does a checklist after Magic 7 help people keep growing their tree?',
        lineBelow: true,
        body: ['Our data showed that 70% of users stop adding relatives after Magic 7. Many see onboarding as finished and don’t realize their tree needs to keep growing to unlock meaningful discoveries. Many also skip the first walkthrough and aren’t sure how to do the basics in the family tree.',
               'The Checklist was designed to close that gap: it teaches users what to do, and gives clear, timely guidance on the next most valuable step.'],
        sections: [
          { title: 'What we measured',
            boldLead: true,
            points: ['Activation after Magic 7. The share of users who add at least one relative once Magic 7 is done.',
                     'More matches. The share of users who get at least one Smart Match, Record Match or Instant Discovery.',
                     'Engagement with matches. Users viewing, confirming or rejecting the matches they get.',
                     'Billing. Conversion rate and net billing, tracked alongside checklist adoption (one task, two, or all), drop-off per task, and activity score.'] }
        ] },
      { title: 'The results',
        line: 'More people kept building their tree',
        lineBelow: true,
        sections: [
          { stats: [
              { number: '+21%', text: 'more users added individuals manually, and the average number of individuals added per user rose by 18%.' },
              { number: '+4.5%', text: 'more users got at least one match, with 7% more users getting match emails.' },
              { number: '+3%', text: 'lift in conversion rate, and +2% in net billing. A positive signal, not yet statistically significant.' }
            ] }
        ] },
      { title: 'What users told us',
        line: 'We surveyed 76 people per variant, to understand what in the Checklist could explain their behavior.',
        lineBelow: true,
        body: ['The Checklist itself was clear: most users understood its parts, including the progress bar and the tasks. Onboarding felt clearer too, with a 2% lift in users rating it “better than expected”.'],
        sections: [
          { title: 'What the survey showed',
            stats: [
              { number: '75%', text: 'of users who got blocked left the site, and 25% tried adding more relatives. That is a chance to suggest another next step.' },
              { number: '~80%', text: 'said “Review your matches” helped them understand the matching idea, and found it useful even before they had a match.' },
              { number: '+5%', text: 'more users said they were clear on what to do next.' }
            ] }
        ] },
      { title: 'What we decided',
        line: 'Roll it out, keep testing what’s still unclear, and pull back what doesn’t help.',
        lineBelow: true,
        body: ['The Checklist drove strong engagement and a clear lift in tree growth, with positive signals on matches and activity. Billing moved in the right direction but isn’t significant yet. The next opportunity: 75% of users who got stuck left the site, so suggesting another next step at that moment could keep them going.']
      }
    ]
  },
  {
    slug: 'minuteful',
    name: 'Minuteful for Wound',
    outcome: 'Provides doctors and senior nurses a consistent and standardized approach to monitoring and treating chronic wounds.',
    role: 'Product designer',
    industry: 'B2B',
    company: 'Healthy.io',
    year: '2024',
    image: 'assets/images/minuteful.jpg',
    backdrop: 'assets/images/minuteful-backdrop.jpg',
    alt: 'Minuteful for Wound Portal observation page with a wound scan, care plan and wound metrics',
    // focal points used for zoomed-in details: "x% y%"
    crops: ['50% 40%', '30% 20%'],
    // which part of the screenshot to keep on phones, where cards are cropped taller
    mobileFocus: '45% 0%',
    // the head image is composed in Figma (a laptop over a photograph), so it fills the frame
    hero: 'assets/images/minuteful/r-hero.webp',
    // the laptop sits straight on the page: no card, hairline or shadow around the head image
    heroBg: 'var(--ground)',
    heroAlt: 'The Minuteful for Wound Portal sign-in screen on a laptop, set on a photograph',
    longTitle: true,
    chaptersTitle: false,
    team: false,
    impactSection: false,
    lead: false,
    // Redesigned case study, from the Figma frame "Case study / Minuteful for Wound".
    // statement: a large centred sentence between chapters (it takes no number).
    chapters: [
      { title: 'The Portal',
        body: ['The portal gives doctors and senior nurses one place to follow chronic wounds. With a focus on uniformity, it streamlines wound management and helps healthcare professionals track progress and make informed decisions efficiently.'],
        line: 'The Observation Page lets healthcare professionals quickly assess the key details of a patient’s wound.',
        lineAfter: true,
        media: { row: { natural: true, images: [
          { src: 'assets/images/minuteful/r-obs-1.jpg', alt: 'The Observation Page with the latest wound record: a wound scan, care plan and wound metrics' },
          { src: 'assets/images/minuteful/r-obs-2.jpg', alt: 'The Observation Page with the wound area over time chart' }
        ] } } },
      { title: 'The User Management Panel',
        body: ['The User Management Panel is designed to support the administrative responsibilities of senior nurses, whose roles extend far beyond clinical duties. Our research showed that a senior nurse is responsible not only for patient care, but also for managing the nursing team, coordinating workflows, overseeing supplies and managing the users of the portal.'],
        media: { src: 'assets/images/minuteful/r-panel.webp', wide: true, bare: true, alt: 'The user management list in the admin panel, on a laptop' } },
      { statement: 'To support the administrative workflow of senior nurses, we added the ability to create new users. It lets senior nurses assign clinical roles and manage each user’s access and permissions.' },
      { title: 'The Screen: adding new user',
        line: 'We had to make two things clear:',
        lineBelow: true,
        body: ['First, each role’s permissions needed a clear explanation, so that administrators can easily choose the right permission level for each user based on their responsibilities. This keeps role management smooth and efficient.',
               'Second, the options had to cover every role in the clinic’s ecosystem, so it is straightforward to select the right type of user.'],
        sections: [
          { line: 'Scroll to view the UX process and our exploration of the add new user screen',
            media: { full: true, strip: { images: [
              { src: 'assets/images/minuteful/r-flow-1.jpg', alt: 'The user list in the admin panel, with the Add new user button' },
              { src: 'assets/images/minuteful/r-flow-2.jpg', alt: 'Add new user, step 2' },
              { src: 'assets/images/minuteful/r-flow-3.jpg', alt: 'Add new user, step 3' },
              { src: 'assets/images/minuteful/r-flow-4.jpg', alt: 'Add new user, step 4' },
              { src: 'assets/images/minuteful/r-flow-5.jpg', alt: 'Add new user, step 5' }
            ] } } },
          { line: 'We ended up with two design directions, which we then tested and validated to find the best solution',
            media: { full: true, bare: true, annotated: { base: 'assets/images/minuteful/r-directions-base.webp', layers: [
              // the "Option 1" and "Option 2" labels, on their own layer so they can turn light in dark mode
              { src: 'assets/images/minuteful/r-directions-labels.webp', at: 0 },
              { src: 'assets/images/minuteful/r-directions-a1.png', at: 0.307 },
              { src: 'assets/images/minuteful/r-directions-a2.png', at: 0.434 },
              { src: 'assets/images/minuteful/r-directions-a3.png', at: 0.671 },
              { src: 'assets/images/minuteful/r-directions-a4.png', at: 0.819 }
            ] }, alt: 'Option 1 with authorized and view-only users, and option 2 with scanner and non-scanner users, next to the four questions we wanted to validate: should we specify which clinical roles are in each permission level, should we explain the capabilities, is the term scanner clear enough, and have we accounted for all the roles in the clinic' } },
          { title: 'We conducted usability testing',
            body: ['We took a thorough approach to testing our design, not only to validate or rule out our assumptions but also to gather new insights from our users. Because our users are far from us, we used Figma’s prototyping tool and Zoom’s screen sharing to run remote usability sessions.'],
            media: { src: 'assets/images/minuteful/r-usability.webp', bare: true, alt: 'A remote usability session on Zoom, with the add new user prototype shown on a phone-sized window' } },
          { title: 'What we took from it',
            points: ['We realized we needed to give greater clarity about what each clinical role is allowed to do.',
                     'We saw how important it is to let users compare all roles at once. It helps administrators make more informed decisions when assigning roles, because they can fully understand the differences between the permissions.',
                     'We learned that people choose with more confidence when the options describe what they will do, not what they are called. Scanner and non-scanner made the right permission obvious.'] },
          { scene: {
              // one pinned scene: as the page scrolls, the text and the big screen change, and a frame slides down the small page on the left
              thumb: { src: 'assets/images/minuteful/r-minimap.jpg', alt: 'The whole add new user screen and the capabilities table, shown small as one long page' },
              steps: [
                { title: "The verdict",
                  body: "It turned out that option 2 gave the nurses greater clarity and more confidence when adding new users to Minuteful for Wound. The design was more intuitive, which made it easier for senior nurses to understand and manage user roles and permissions. It streamlined the process and improved their overall experience.",
                  // where the frame sits on the small page, as a share of its height
                  frame: { y: 0, h: 0.5113 },
                  media: { src: 'assets/images/minuteful/r-verdict.webp', alt: "Add new user form with option 2, scanner and non-scanner permission types" } },
                { title: "Capabilities breakdown",
                  body: "Testing showed that nurses wanted to compare roles in one place. We drew inspiration from pricing comparison pages, where plans are clearly explained and compared side by side. We applied the same principle, so administrators can compare the capabilities of different clinical roles at a glance and assign the most suitable permissions for their team.",
                  frame: { y: 0.5094, h: 0.4937 },
                  media: { src: 'assets/images/minuteful/r-capabilities.webp', alt: "Capabilities breakdown table comparing what each clinical role can do" } }
              ] } }
        ] }
    ]
  }
];

window.caseStudyUrl = (slug) => 'case-study.html?project=' + encodeURIComponent(slug);
