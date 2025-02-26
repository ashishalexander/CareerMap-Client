// app/api/save-user/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, image } = body;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL }/api/users/Oauth-datasave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, image }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ message: data.message }, { status: 200 });
    } else {
      return NextResponse.json({ message: data.message }, { status: response.status });
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to communicate with backend' }, { status: 500 });
  }
}
