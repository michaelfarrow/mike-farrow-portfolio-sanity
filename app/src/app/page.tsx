import Image from 'next/image';
import styles from './page.module.css';
import { getEvents, getEvent, Event, Venue } from '@/lib/sanity';

type Test = Event['venue'];

function EventComponent({
  name,
  venue,
}: Pick<Event, 'name'> & { venue?: Pick<Venue, 'name'> | null }) {
  return (
    <div>
      {name || 'no name'}
      {(venue && ` - ${venue.name}`) || null}
    </div>
  );
}

// import { internalGroqTypeReferenceTo } from '@/types/sanity';

// type Venue = SchemaType<>;

// // type Test = Extract<
// //   NonNullable<Event['venue']>,
// //   { [internalGroqTypeReferenceTo]?: 'venue' }
// // >;

// type Test = NonNullable<
//   NonNullable<Event['venue']>[typeof internalGroqTypeReferenceTo]
// >;

// type EventLimited = Pick<
//   NonNullable<Awaited<ReturnType<typeof getEvent>>>,
//   'name'
// >;

// type Test = {
//   [internalGroqTypeReferenceTo]?: 'sanity.imageAsset';
// };

export default async function Home() {
  const events = await getEvents();
  const event = await getEvent('b8259d1d-47ad-481a-943a-7bb4d670769d');

  return (
    <div className={styles.page}>
      <div>{events.length}</div>
      <div>
        {events.map((e) => (
          <div key={e._id}>{e.slug.current}</div>
        ))}
      </div>
      {event && <EventComponent {...event} />}
      {/* {JSON.stringify(event)} */}
      {/* {(event?.image && 'url' in event.image && (
        <img src={event.image.url} />
      )) ||
        null} */}
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src='/next.svg'
          alt='Next.js logo'
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              className={styles.logo}
              src='/vercel.svg'
              alt='Vercel logomark'
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='/file.svg'
            alt='File icon'
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='/window.svg'
            alt='Window icon'
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='/globe.svg'
            alt='Globe icon'
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
