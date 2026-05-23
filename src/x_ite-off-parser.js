
/*
 *  Grammar
 */

// Lexical elements
const Grammar = X3D .Expressions ({
   // General
   whitespaces: /[\x20\n\t\r,]+/y,
   comment: /#[^\r\n]*(?=[\r\n]|$)/y,
   header: /OFF/y,

   // Values
   int32:  /(?:0[xX][\da-fA-F]+)|(?:[+-]?\d+)/y,
   double: /[+-]?(?:(?:(?:\d*\.\d+)|(?:\d+(?:\.)?))(?:[eE][+-]?\d+)?)/y,
});

/*
 * Parser
 */

class OffParser extends X3D .X3DParser
{
   constructor (scene)
   {
      super (scene);

      this .coordIndex = [ ];
      this .colorIndex = [ ];
      this .colors     = [ ];
      this .points     = [ ];
   }

   getEncoding ()
   {
      return "STRING";
   }

   setInput (input)
   {
      this .input = input;
   }

   isValid ()
   {
      return this .input .match (/OFF\r?\n/);
   }

   parseIntoScene (resolve, reject)
   {
      this .off ()
         .then (resolve)
         .catch (reject);
   }

   async off ()
   {
      const
         browser = this .getBrowser (),
         scene   = this .getScene ();

      scene .setEncoding ("OFF");
      scene .setProfile (browser .getProfile ("Interchange"));

      await this .loadComponents ();

      // Geometry

      const
         shapeNode      = scene .createNode ("Shape"),
         appearanceNode = scene .createNode ("Appearance"),
         materialNode   = scene .createNode ("Material"),
         geometry       = scene .createNode ("IndexedFaceSet"),
         coordinate     = scene .createNode ("Coordinate");

      geometry .coord = coordinate;

      appearanceNode .material = materialNode;

      shapeNode .appearance = appearanceNode;
      shapeNode .geometry   = geometry;

      scene .rootNodes .push (shapeNode);

      if (!this .statements ())
         throw new Error ("Invalid file structure.");

      coordinate .point    = this .points;
      geometry .coordIndex = this .coordIndex;

      if (this .colors .length)
      {
         const color = scene .createNode ("Color");

         color .color = this .colors;

         geometry .colorPerVertex = false;
         geometry .colorIndex     = this .colorIndex;
         geometry .color          = color;
      }

      return scene;
   }

   statements ()
   {
      this .header ();

      if (this .counts ())
      {
         if (this .listOfVertices ())
         {
            if (this .listOfFaces ())
               return true;
         }
      }

      return false;
   }

   comments ()
   {
      while (this .comment ())
         ;
   }

   comment ()
   {
      this .whitespaces ();

      if (Grammar .comment .parse (this))
         return true;

      return false;
   }

   whitespaces ()
   {
      Grammar .whitespaces .parse (this);
   }

   header ()
   {
      return Grammar .header .parse (this);
   }

   counts ()
   {
      this .comments ();

      if (this .int32 ())
      {
         this .numVertices = this .value;

         if (this .int32 ())
         {
            this .numFaces = this .value;

            if (this .int32 ())
            {
               this .numEdges = this .value;

               return true;
            }
         }
      }

      return false;
   }

   listOfVertices ()
   {
      const
         numVertices = this .numVertices,
         points      = this .points;

      for (let v = 0; v < numVertices; ++ v)
      {
         this .comments ();

         if (this .double ())
         {
            points .push (this .value);

            if (this .double ())
            {
               points .push (this .value);

               if (this .double ())
               {
                  points .push (this .value);
                  continue;
               }
            }
         }

         return false;
      }

      return true;
   }

   listOfFaces ()
   {
      const
         coordIndex = this .coordIndex,
         numFaces   = this .numFaces;

      for (let f = 0; f < numFaces; ++ f)
      {
         this .comments ();

         if (this .int32 ())
         {
            const numIndices = this .value;

            for (let i = 0; i < numIndices; ++ i)
            {
               if (this .int32 ())
               {
                  coordIndex .push (this .value);
                  continue;
               }

               return false;
            }

            coordIndex .push (-1);

            if (this .int32 ())
            {
               this .colors .push (this .value);

               if (this .int32 ())
               {
                  this .colors .push (this .value);

                  if (this .int32 ())
                  {
                     this .colors .push (this .value);
                     this .colorIndex .push (this .colorIndex .length);
                  }
               }
            }

            continue;
         }

         return false;
      }

      return true;
   }

   int32 ()
   {
      this .whitespaces ();

      if (Grammar .int32 .parse (this))
      {
         this .value = parseInt (this .result [0]);

         return true;
      }

      return false;
   }

   double ()
   {
      this .whitespaces ();

      if (Grammar .double .parse (this))
      {
         this .value = parseFloat (this .result [0]);

         return true;
      }

      return false;
   }
}

X3D .GoldenGate .addParsers (OffParser);
