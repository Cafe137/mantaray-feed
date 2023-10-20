```ts
const jsonStorage = new JsonStorage(privateKey)
const myProfile = await jsonStorage.get('my-profile')
myProfile.age += 1
await jsonStorage.put('my-profile', myProfile)
```
