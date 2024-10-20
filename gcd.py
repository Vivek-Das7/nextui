// Java Program to find the Greatest Common
// divisor of two number which is in given
// range
import java.io.*;

class GFG {
	
	// Return the greatest common divisor
	// of two numbers
	static int gcd(int a, int b)
	{
		if (b == 0)
			return a;
		return gcd(b, a % b);
	}
	
	// Return the greatest common divisor of a
	// and b which lie in the given range.
	static int maxDivisorRange(int a, int b, 
								int l, int h)
	{
		int g = gcd(a, b);
		int res = -1;
	
		// Loop from 1 to sqrt(GCD(a, b).
		for (int i = l; i * i <= g && i <= h; i++) 
	
			// if i divides the GCD(a, b), then 
			// find maximum of three numbers res,
			// i and g/i
			if (g % i == 0)
				res = Math.max(res,
							Math.max(i, g / i));
		
		return res;
	}
	
	// Driven Program
	public static void main (String[] args) 
	{
		int a = 3, b = 27, l = 1, h = 5;
		System.out.println( 
			maxDivisorRange(a, b, l, h));
	}
}

// This code is contributed by anuj_67.
