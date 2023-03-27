export default function Profile() {
  return null;
}

export function getServerSideProps() {
  return { redirect: { destination: "/profile/dashboard" } };
}
