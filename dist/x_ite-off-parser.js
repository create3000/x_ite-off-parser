/******/ (() => { // webpackBootstrap

;// ./node_modules/x_ite-extension/dist/x_ite-extension.js
/******/ // The require scope
/******/ var __nested_webpack_require_43__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__nested_webpack_require_43__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__nested_webpack_require_43__.o(definition, key) && !__nested_webpack_require_43__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__nested_webpack_require_43__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __nested_webpack_exports__ = {};
/* harmony export */ __nested_webpack_require_43__.d(__nested_webpack_exports__, {
/* harmony export */   A: () => (/* binding */ register)
/* harmony export */ });
function register (callback)
{
   const X3D = window [Symbol .for ("X_ITE.X3D")];

   if (X3D)
      callback (X3D);
   else
      (window [Symbol .for ("X_ITE.extensions")] ??= [ ]) .push (callback);
};

const __webpack_exports__default = __nested_webpack_exports__.A;


;// ./src/x_ite-off-parser.js


__webpack_exports__default (X3D =>
{
   /*
   *  Grammar
   */

   // Lexical elements
   const Grammar = X3D .Expressions ({
      // General
      whitespaces: /[\x20\n\t\r,]+/y,
      whitespacesNoLineTerminator: /[\x20\t]+/y,
      untilEndOfLine: /[^\r\n]+/y,
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

         this .lineNumber = 1;
         this .coordIndex = [ ];
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
         return this .input .match (/^OFF/);
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

         if (!this .statements ())
            throw new Error (`Couldn't parse OFF file: Invalid file structure at line ${this .lineNumber}.`);

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

         if (this .colors .length / 3 === this .numFaces)
         {
            const color = scene .createNode ("Color");

            color .color             =  this .colors;
            geometry .colorPerVertex = false;
            geometry .color          = color;
         }

         coordinate .point    = this .points;
         geometry .coordIndex = this .coordIndex;
         geometry .coord      = coordinate;

         appearanceNode .material = materialNode;

         shapeNode .appearance = appearanceNode;
         shapeNode .geometry   = geometry;

         scene .rootNodes .push (shapeNode);

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

                     this .untilEndOfLine ();
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
            colors     = this .colors,
            numFaces   = this .numFaces;

         let face = 0;

         for (let f = 0; f < numFaces; ++ f)
         {
            this .comments ();

            if (this .int32 ())
            {
               const numIndices = this .value;

               if (numIndices >= 3)
               {
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

                  const lastIndex = this .lastIndex;

                  if (this .int32 ())
                  {
                     const r = this .value;

                     if (this .int32 ())
                     {
                        const g = this .value;

                        if (this .int32 ())
                           colors .push (r / 255, g / 255, this .value / 255);
                     }
                     else
                     {
                        this .lastIndex = lastIndex;

                        if (this .double ())
                        {
                           const r = this .value;

                           if (this .double ())
                           {
                              const g = this .value;

                              if (this .double ())
                                 colors .push (r, g, this .value);
                           }
                        }
                     }
                  }

                  ++ face;
               }

               this .untilEndOfLine ();
               continue;
            }

            return false;
         }

         this .numFaces = face;

         return true;
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
         if (Grammar .whitespaces .parse (this))
            this .lines (this .result [0]);
      }

      whitespacesNoLineTerminator ()
      {
         Grammar .whitespacesNoLineTerminator .parse (this);
      }

      untilEndOfLine ()
      {
         Grammar .untilEndOfLine .parse (this);
      }

      lines (string)
      {
         const match = string .match (Grammar .LineFeed);

         if (match)
            this .lineNumber += match .length;
      }

      int32 ()
      {
         this .whitespacesNoLineTerminator ();

         if (Grammar .int32 .parse (this))
         {
            this .value = parseInt (this .result [0]);

            return true;
         }

         return false;
      }

      double ()
      {
         this .whitespacesNoLineTerminator ();

         if (Grammar .double .parse (this))
         {
            this .value = parseFloat (this .result [0]);

            return true;
         }

         return false;
      }
   }

   X3D .GoldenGate .addParsers (OffParser);
});

/******/ })()
;