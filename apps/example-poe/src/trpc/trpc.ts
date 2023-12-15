import { router } from "./utils";
import { createTrpcContext } from "./trpc-context";
import { SummaryRouter } from "./routers/summary.router";
import { NoteRouter } from "./routers/note.router";
import { userRouter } from "./routers/user.router";
export const appRouter = router({
	user: userRouter,
	summary: SummaryRouter,
	note: NoteRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

export { createTrpcContext };
