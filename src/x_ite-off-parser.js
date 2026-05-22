console .info ("x_ite-off-parser loaded.");

class OffParser extends X3D .X3DParser
{
   constructor (scene)
   {
      super (scene);
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
         boxNode        = scene .createNode ("Box");

      appearanceNode .material = materialNode;

      shapeNode .appearance = appearanceNode;
      shapeNode .geometry   = boxNode;

      scene .rootNodes .push (shapeNode);

      return scene;
   }
}

X3D .GoldenGate .addParsers (OffParser);
