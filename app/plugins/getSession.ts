export default async function () {
  const auth = useAuth()
  await auth.fetchUser()
}
