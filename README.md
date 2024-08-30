# Shop.app Administration — NextJS

![screenshot](https://github.com/Fmd0/assets/blob/main/shop-administration.jpg?raw=true)

This is a complete clone of [shop.app](https://shop.app), consisting of three parts: shop [frontend](https://github.com/Fmd0/Shop.app-frontend), shop [backend](https://github.com/Fmd0/Shop-backend), and shop [administration](https://github.com/Fmd0/Shop-administration-nextjs).

This is the shop administration part of the project. It is feature-rich and scalable, including seven major parts such as 

It doesn't provide a live example, but you can deploy and run it on your own machine.

Features:

- Typescript, NextJS Setup 
- MongoDB & Prisma connect, Database creation
- SWR, data fetching and mutation
- UI developed using material-ui
- Tailwind CSS for customization of UI
- Image storage powered by Cloudinary


### Clone the repository

```shell
git clone https://github.com/Fmd0/Shop-administration-nextjs.git
```

### Install packages

```shell
npm i
```

### Setup .env file

```env
# make sure mongodb is installed on your computer
DATABASE_URL=
```

### Setup prisma

```shell
npx prisma db push
```

### Start the app

```shell
npm run dev
```
