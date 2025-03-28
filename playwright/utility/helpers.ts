import { UUID } from 'crypto';

/** Note that this predicate checks specifically for version 4 of a UUID per {@link  https://datatracker.ietf.org/doc/html/rfc9562#name-uuid-version-4 RFC 9562} */
export const isRandomUuid = (uuid: string): uuid is UUID => {
  const uuidPatternV4 =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPatternV4.test(uuid);
};
