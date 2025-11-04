import LandingPage from "./landingpage";
import { PrismaClient } from 'app/generated-prisma-client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
export default function Wfa() {
  return <LandingPage />;
}