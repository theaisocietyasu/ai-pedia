// import { NextResponse } from 'next/server';
// import { getServerSession } from '@/lib/auth/server';
// import { hasRequiredDiscordRole } from '@/lib/auth/discord-roles';

// /**
//  * API endpoint to verify if the current user has the required Discord admin role
//  */
// export async function GET() {
//   try {
//     // Get current session
//     const session = await getServerSession();

//     if (!session?.user) {
//       return NextResponse.json(
//         { hasRole: false, error: 'Not authenticated' },
//         { status: 401 }
//       );
//     }

//     // Check Discord role
//     const discordUserId = (session.user as any).discordId;

//     if (!discordUserId) {
//       return NextResponse.json(
//         { hasRole: false, error: 'Discord account not linked' },
//         { status: 400 }
//       );
//     }

//     const hasRole = await hasRequiredDiscordRole(discordUserId);

//     if (!hasRole) {
//       return NextResponse.json(
//         {
//           hasRole: false,
//           error: 'You must have the admin role in the Discord server to access this application.'
//         },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json({ hasRole: true });
//   } catch (error) {
//     console.error('Error verifying Discord role:', error);
//     return NextResponse.json(
//       { hasRole: false, error: 'Failed to verify Discord role' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Temporary bypass role verification (development mode)
    return NextResponse.json({ hasRole: true });
  } catch {
    return NextResponse.json({ hasRole: true });
  }
}
