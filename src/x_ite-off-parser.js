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
      scene .updateComponent (browser .getComponent ("Sound", 1));

      return scene;
   }
}

X3D .GoldenGate .addParsers (OffParser);
