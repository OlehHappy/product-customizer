using Atalasoft.Imaging;
using Atalasoft.Imaging.Codec;
using Atalasoft.Imaging.Drawing;
using Atalasoft.Imaging.ImageProcessing;
using Atalasoft.Imaging.ImageProcessing.Transforms;
using Newtonsoft.Json.Linq;
using PrideBitesCustomizer.Domain.Services;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace Shopify
{
    public class ImageProcessor
    {
        //color map used so client can pass in a string name and get the proper hex val.
        private static Dictionary<string, string> TextColorMap = new Dictionary<string, string> { 
            {"Red", "c2002f"},
            {"Orange","f68d29"},
            {"Yellow","ffd923"},
            {"Teal","9cd8d8"},
            {"Green","009877"},
            {"Blue","005cb8"},
            {"Purple","853175"},
            {"Pink", "e51992"},
            {"Black", "000000"},
            {"White", "ffffff"},
            {"LightGray", "b4b2b2"},
            {"Tan", "cfb4a7"},  
            {"Brown", "5d3326"},
            {"DarkGreen", "404726"},
            {"NavyBlue", "003763"},
            {"Wine", "79232e"} 
        };

        public static byte[] UploadImage(string displayMode, int x, int y, int h, int w)
        {
            string path = HttpContext.Current.Server.MapPath("~/AppContent/RenderImages/uploadPlaceholder.png");
            
            using (AtalaImage image = new AtalaImage(856, 500, PixelFormat.Pixel32bppBgra, Color.Transparent))
            {
                using (AtalaImage uploadImage = new AtalaImage(path))
                {
                    var g = image.GetGraphics();
                    g.DrawImage(uploadImage.ToBitmap(), new Rectangle(x, y, w, h));
                    byte[] data = null;
                    using (MemoryStream m = new MemoryStream())
                    {
                        PngEncoder encoder = new PngEncoder();
                        encoder.Save(m, image, null);
                        data = m.ToArray();
                    }
                    return data;
                }
            }
        }

        private static void ApplyRotation(Graphics g, int rotation, int posX, int posY)
        {
            if (rotation != 0)
            {
                g.TranslateTransform(posX, posY);
                g.RotateTransform(rotation);
                g.TranslateTransform(-posX, -posY);
            }
        }
        private static void FinishRotation(Graphics g, int rotation, int posX, int posY)
        {
            if (rotation != 0)
            {
                g.TranslateTransform(posX, posY);
                g.RotateTransform(-rotation);
                g.TranslateTransform(-posX, -posY);
            }
        }
        
        /// <summary>
        /// This mehtod generates a composite image that includes all layers so we have a full product thumbnail
        /// </summary>
        /// <param name="size"></param>
        /// <param name="d"></param>
        /// <returns></returns>
        public static byte[] Thumbnail(string size, string d)   
        {
            Size thumbSize = new Size(107, 67);
            if (size == "medium")
                thumbSize = new Size(160, 100);
            else if (size == "large")
                thumbSize = new Size(320, 200);
            
            using (AtalaImage image = new AtalaImage(thumbSize.Width, thumbSize.Height, PixelFormat.Pixel32bppBgra, Color.Transparent))
            {
                string product = string.Empty;
                string view = "default";
                
                #region Build layers from input json
                //expected format
                //[["productName","Bed"],["Size","Small"],["Top","NavyBlue"],["Side","NavyBlue"],["Piping","Pink"],["text",""],["banner","Oval"],["font","BigDog.TTF"],["textColor","000000"],["image1",""],["image2",""],["image3",""]]
                var props = JsonHelper.Decode(d);
                string[] skippedProperties = {"Size","text","banner","font", "textColor", "image1","image2","image3"};
                var layers = new List<KeyValuePair<string,string>>();
                var allProperties = new List<KeyValuePair<string, string>>();
                foreach (var prop in props)
                {
                    string key = prop[0];
                    string value = prop[1];
                    allProperties.Add(new KeyValuePair<string, string>(key, value));
                    if (skippedProperties.Contains(key))
                        continue;
                    if (key == "productName")
                        product = value;
                    else
                        layers.Add(new KeyValuePair<string, string>(key, value));
                }
                #endregion

                #region Draw Layers
                var g = image.GetGraphics();
                g.TextRenderingHint = TextRenderingHint.AntiAlias;
                #region Draw Base
                string basePath = HttpContext.Current.Server.MapPath(string.Format("~/AppContent/ProductImages/{0}/{1}/base.png", product, view));
                if(File.Exists(basePath))
                {
                    using (AtalaImage uploadImage = new AtalaImage(basePath))
                    {
                        g.DrawImage(uploadImage.ToBitmap(), new RectangleF(0, 0, thumbSize.Width, thumbSize.Height));
                    }
                }
                #endregion
                foreach (var layer in layers)
                {
                    string imgPath = HttpContext.Current.Server.MapPath(string.Format("~/AppContent/ProductImages/{0}/{1}/{2}-{3}.png", product, view, layer.Key, layer.Value));
                    using (AtalaImage uploadImage = new AtalaImage(imgPath))
                    {
                        g.DrawImage(uploadImage.ToBitmap(), new RectangleF(0, 0, thumbSize.Width, thumbSize.Height));
                    }
                    
                }
                #endregion

                #region Draw Text
                //Get product properties
                //string[] skippedProperties = { "Size", "text", "banner", "font", "textColor", "image1", "image2", "image3" };
                var textProp = allProperties.Where(kvp => kvp.Key == "text").FirstOrDefault();
                if (!string.IsNullOrEmpty(textProp.Value))
                {
                    dynamic productSchema = ProductSchemaProvider.GetProductSchema(product);
                    var defaultView = productSchema.views[0];
                    var textLayer = ((IEnumerable)defaultView.layers).Cast<dynamic>().Where(l => l.displayType == "text").FirstOrDefault();
                    if (textLayer != null)
                    {
                        JToken defaults = (JToken)textLayer.defaults;

                        var colorProp = allProperties.Where(kvp => kvp.Key == "textColor").FirstOrDefault();
                        var fontProp = allProperties.Where(kvp => kvp.Key == "font").FirstOrDefault();
                        var bannerProp = allProperties.Where(kvp => kvp.Key == "banner").FirstOrDefault();
                        var image1Prop = allProperties.Where(kvp => kvp.Key == "image1").FirstOrDefault();

                        var placeholderImageLocation = "";

                        // TODO: Clean this up
                        if (image1Prop.Value != null)
                        {
                            if (product == "Frisbee")
                            {
                                placeholderImageLocation = "placeholder";
                            }
                            else
                            {
                                placeholderImageLocation = "placeholder2";
                            }
                        }

                        byte[] textImage = TextImage(defaults.GetValue<string>("drawMode", ""),
                                                     textProp.Value,
                                                     colorProp.Value != null ? colorProp.Value : defaults.GetValue<string>("textColor"),
                                                     defaults.GetValue<int>("Size", 40),
                                                     fontProp.Value != null ? fontProp.Value : defaults.GetValue<string>("font"),
                                                     defaults.GetValue<int>("x", 0),
                                                     defaults.GetValue<int>("y", 0),
                                                     defaults.GetValue<int>("h", 0),
                                                     defaults.GetValue<int>("w", 0),
                                                     defaults.GetValue<int>("r1", 0),
                                                     defaults.GetValue<int>("s2", 0),
                                                     defaults.GetValue<string>("align", ""),
                                                     defaults.GetValue<int>("x2", 320),
                                                     defaults.GetValue<int>("y2", 110),
                                                     defaults.GetValue<int>("h2", 260),
                                                     defaults.GetValue<int>("w2", 220),
                                                     defaults.GetValue<int>("r2", 0),
                                                     defaults.GetValue<int>("s2", 0),
                                                     bannerProp.Value != null ? bannerProp.Value : defaults.GetValue<string>("banner"),
                                                     image1Prop.Value != null ? placeholderImageLocation : string.Empty);
                        using (var textImageMemory = new MemoryStream(textImage))
                        {
                            using (AtalaImage uploadImage = new AtalaImage(textImageMemory))
                            {
                                g.DrawImage(uploadImage.ToBitmap(), new RectangleF(0, 0, thumbSize.Width, thumbSize.Height));
                            }
                        }
                    }
                }
                #endregion

                #region Save Image
                byte[] data = null;
                using (MemoryStream m = new MemoryStream())
                {
                    PngEncoder encoder = new PngEncoder();
                    encoder.Save(m, image, null);
                    data = m.ToArray();
                    return data;
                }
                #endregion
            }
        }

        /// <summary>
        /// This method generates a single layer of a product image used int the product customization tool
        /// </summary>
        /// <param name="drawMode"></param>
        /// <param name="text"></param>
        /// <param name="textColor"></param>
        /// <param name="size"></param>
        /// <param name="font"></param>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="h"></param>
        /// <param name="w"></param>
        /// <param name="r1"></param>
        /// <param name="s1"></param>
        /// <param name="align"></param>
        /// <param name="x2"></param>
        /// <param name="y2"></param>
        /// <param name="h2"></param>
        /// <param name="w2"></param>
        /// <param name="r2"></param>
        /// <param name="s2"></param>
        /// <param name="banner"></param>
        /// <param name="imgSrc"></param>
        /// <returns></returns>
        public static byte[] TextImage(string drawMode, string text, string textColor, float size, string font, int x, int y, int h, int w, int r1, int s1, string align,
                                       int x2, int y2, int h2, int w2, int r2, int s2, string banner, string imgSrc)
        {
            bool debug = false;
            string path = HttpContext.Current.Server.MapPath(string.Format("~/AppContent/fonts/{0}", font));
            var fontCollection = new PrivateFontCollection();

            if (TextColorMap.Keys.Contains(textColor))
                textColor = TextColorMap[textColor]; //Replace text colorname from client with the hex value stored in our map
            textColor = "#" + textColor;

            using (var FontFamily = LoadFontFamily(path, out fontCollection))
            using (var DrawFont = new Font(FontFamily, size))
            using (AtalaImage image = new AtalaImage(856, 500, PixelFormat.Pixel32bppBgra, Color.Transparent))
            {
                var g = image.GetGraphics();
                g.TextRenderingHint = TextRenderingHint.AntiAlias;
                SizeF textSize = SizeF.Empty;
                Font scaledFont = null;

                #region Draw Image
                if (imgSrc != string.Empty)
                {
                    string imgPath = "";
                    if (imgSrc == "placeholder")
                    {
                        imgPath = HttpContext.Current.Server.MapPath("~/AppContent/RenderImages/uploadPlaceholder.png");
                    }
                    else 
                    {
                        imgPath = HttpContext.Current.Server.MapPath("~/AppContent/RenderImages/uploadPlaceholderTwo.png");
                    }
                    //else - handle upladed images
                    using (AtalaImage uploadImage = new AtalaImage(imgPath))
                    {
                        //For rendering image relative to text
                        //float offsetX = 0;
                        //float offsetY = -1 * (h2 / 4);

                        //float padding = 10;
                        //if (align == "center" && textSize.Width == 0)
                        //    offsetX = (w / 2) - (w2 / 2);
                        //else
                        //    offsetX = -1 * (w2 + padding);

                        //g.DrawImage(uploadImage.ToBitmap(), new RectangleF(x + offsetX, y + offsetY, w2, h2));
                        ApplyRotation(g, r2, x2, y2);
                        if (s2 != 0)
                        {//SKEW The image so it looks ok at an angle.  Currently only used on the bed.
                            Point[] points = new Point[3] { new Point(x2, y2), new Point(x2 + w2, y2 + s2), new Point(x2, y2 + h2) };
                            g.DrawImage(uploadImage.ToBitmap(), points);
                        }
                        else
                            g.DrawImage(uploadImage.ToBitmap(), new RectangleF(x2, y2, w2, h2));
                        FinishRotation(g, r2, x2, y2);
                    }
                }
                #endregion
                if (drawMode != "curved")
                {
                    #region GetTextSize
                    textSize = SizeF.Empty;
                    scaledFont = FindGoodFont(g, text, new Size(w, h), DrawFont, GraphicsUnit.Point);

                    textSize = g.MeasureString(text, scaledFont, w, StringFormat.GenericTypographic);
                    #endregion
                    #region DrawBanner
                    if (!string.IsNullOrEmpty(banner) && !string.IsNullOrEmpty(text))
                    {
                        string imgPath = HttpContext.Current.Server.MapPath(string.Format("~/AppContent/RenderImages/banner-{0}.png", banner));
                        using (AtalaImage bannerImage = new AtalaImage(imgPath))
                        {
                            int bannerWidth = 211;
                            int bannerHeight = 86;
                            //Center banner arround Text placeholder
                            int bannerOffsetX = (int)((bannerWidth - w) / 2);
                            int bannerOffsetY = (int)((bannerHeight - h) / 2);
                            ApplyRotation(g, r1, x, y);
                            g.DrawImage(bannerImage.ToBitmap(), new Rectangle(new Point(x - bannerOffsetX, y - bannerOffsetY), new Size(bannerWidth, bannerHeight)));
                            if (debug)
                            {
                                g.DrawRectangle(new Pen(new SolidBrush(Color.Green)), new Rectangle(x - bannerOffsetX, y - bannerOffsetY, bannerWidth, bannerHeight));
                            }
                            FinishRotation(g, r1, x, y);
                        }
                    }
                    #endregion
                }
                #region Draw Text
                if (debug)
                {
                    //Debug Outline to assist in template placement
                    ApplyRotation(g, r1, x, y);
                    g.DrawRectangle(new Pen(new SolidBrush(Color.Red)), new Rectangle(x, y, w, h));
                    FinishRotation(g, r1, x, y);
                    ApplyRotation(g, r2, x2, y2);
                    g.DrawRectangle(new Pen(new SolidBrush(Color.Purple)), new Rectangle(x2, y2, w2, h2));
                    FinishRotation(g, r2, x2, y2);
                }
               
                if (drawMode == "curved")
                    DrawCurvedText(g, text, new Point(x, y), w, (float)((3 * Math.PI) / 4), DrawFont, new SolidBrush(ColorTranslator.FromHtml(textColor)));
                else
                {
                    #region Get String Format
                    StringFormat stringFormat = null;
                    float offsetY = 0;
                    if (align.ToLower() == "center")
                        stringFormat = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center, FormatFlags = StringFormatFlags.NoWrap };
                    else
                    {
                        stringFormat = new StringFormat { Alignment = StringAlignment.Near, LineAlignment = StringAlignment.Near, FormatFlags = StringFormatFlags.NoWrap };
                        offsetY = h2;
                    }
                    #endregion

                    ApplyRotation(g, r1, x, (int)(y+offsetY));
                    g.DrawString(text, scaledFont, new SolidBrush(ColorTranslator.FromHtml(textColor)), new RectangleF(x, y + offsetY, w, h), stringFormat);
                    FinishRotation(g, r1, x, (int)(y+offsetY));

                    //debug
                    ApplyRotation(g, r1, x, (int)(y + offsetY));
                    if (debug)
                    {
                        g.DrawRectangle(new Pen(new SolidBrush(Color.Blue)), new Rectangle(x, (int)(y + offsetY), (int)textSize.Width, (int)textSize.Height));
                        g.DrawRectangle(new Pen(new SolidBrush(Color.HotPink)), new Rectangle(x, (int)(y + offsetY), w, h));
                    }
                    FinishRotation(g, r1, x, (int)(y + offsetY));
                }
                #endregion
               
                #region Save Image
                byte[] data = null;
                using (MemoryStream m = new MemoryStream())
                {
                    PngEncoder encoder = new PngEncoder();
                    encoder.Save(m, image, null);
                    data = m.ToArray();
                }
                fontCollection.Dispose();
                g.Dispose();
                return data;
                #endregion
            }
        }

        //public static Bitmap TextToBitmap(String TheText)
        //{
        //    Font DrawFont = null;
        //    FontFamily FontFamiily = null;
        //    Graphics DrawGraphics = null;
        //    Bitmap TextBitmap = null;
        //    PrivateFontCollection fontCollection = null;
        //    try
        //    {
        //        // start with empty bitmap, get it's graphic's object
        //        // and choose a font
        //        TextBitmap = new Bitmap(1, 1, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
        //        DrawGraphics = Graphics.FromImage(TextBitmap);
                

        //        fontCollection = new PrivateFontCollection();
        //        string path = HttpContext.Current.Server.MapPath("~/App_Data/Laine.TTF");
        //        FontFamiily = LoadFontFamily(path, out fontCollection);
        //        DrawFont = new Font(FontFamiily, 60.0f);


        //        // see how big the text will be
        //        int Width = (int)DrawGraphics.MeasureString(TheText, DrawFont).Width;
        //        int Height = (int)DrawGraphics.MeasureString(TheText, DrawFont).Height;


        //        // recreate the bitmap and graphic object with the new size
        //        TextBitmap = new Bitmap(TextBitmap, Width, Height);
        //        DrawGraphics = Graphics.FromImage(TextBitmap);
                

        //        // get the drawing brush and where we're going to draw
        //        PointF DrawPoint = new PointF(0, 0);

        //        // clear the graphic white and draw the string
        //        DrawGraphics.Clear(Color.Transparent);
        //        DrawGraphics.DrawString(TheText, DrawFont, Brushes.Black, DrawPoint);


        //        return TextBitmap;
        //    }
        //    finally
        //    {
        //        // don't dispose the bitmap, the caller needs it.
        //        DrawFont.Dispose();
        //        DrawGraphics.Dispose();
        //        fontCollection.Dispose();
        //    }
        //}

        private static FontFamily LoadFontFamily(string fileName, out PrivateFontCollection fontCollection) {
           fontCollection = new PrivateFontCollection();
           fontCollection.AddFontFile(fileName);
           return fontCollection.Families[0];
        }

        // You hand this the text that you need to fit inside some
        // available room, and the font you'd like to use.
        // If the text fits nothing changes
        // If the text does not fit then it is reduced in size to
        // make it fit.
        // PreferedFont is the Font that you wish to apply
        // FontUnit is there because the default font unit is not
        // always the one you use, and it is info required in the
        // constructor for the new Font.
        private static Font FindGoodFont(Graphics Graf, string sStringToFit,
                                        Size TextRoomAvail,
                                        Font FontToUse,
                                        GraphicsUnit FontUnit)
        {
            // Find out what the current size of the string in this font is
            SizeF RealSize = Graf.MeasureString(sStringToFit, FontToUse);
           
            if ((RealSize.Width <= TextRoomAvail.Width) && (RealSize.Height <= TextRoomAvail.Height))
            {
                return FontToUse;
            }

            // Either width or height is too big...
            // Usually either the height ratio or the width ratio
            // will be less than 1. Work them out...
            float HeightScaleRatio = TextRoomAvail.Height / RealSize.Height;
            float WidthScaleRatio = TextRoomAvail.Width / RealSize.Width;

            // We'll scale the font by the one which is furthest out of range...
            float ScaleRatio = (HeightScaleRatio < WidthScaleRatio) ? ScaleRatio = HeightScaleRatio : ScaleRatio = WidthScaleRatio;
            float ScaleFontSize = FontToUse.Size * ScaleRatio;

            // Retain whatever the style was in the old font...
            FontStyle OldFontStyle = FontToUse.Style;

            // Get rid of the old non working font...
            FontToUse.Dispose();

            // Tell the caller to use this newer smaller font.
            FontToUse = new Font(FontToUse.FontFamily,
                                    ScaleFontSize,
                                    OldFontStyle,
                                    FontUnit);
            return FontToUse;
        }


        #region Rounded Text
        private static void DrawCurvedText(Graphics graphics, string text, Point centre, float distanceFromCentreToBaseOfText, float radiansToTextCentre, Font font, Brush brush)
        {
            // Circumference for use later
            var circleCircumference = (float)(Math.PI * 2 * distanceFromCentreToBaseOfText);

            // Get the width of each character
            var characterWidths = GetCharacterWidths(graphics, text, font).ToArray();

            // The overall height of the string
            var characterHeight = graphics.MeasureString(text, font).Height;

            var textLength = characterWidths.Sum();

            // The string length above is the arc length we'll use for rendering the string. Work out the starting angle required to 
            // centre the text across the radiansToTextCentre.
            float fractionOfCircumference = textLength / circleCircumference;

            float currentCharacterRadians = radiansToTextCentre + (float)(Math.PI * fractionOfCircumference);

            for (int characterIndex = 0; characterIndex < text.Length; characterIndex++)
            {
                char @char = text[characterIndex];

                // Polar to cartesian
                float x = (float)(distanceFromCentreToBaseOfText * Math.Sin(currentCharacterRadians));
                float y = -(float)(distanceFromCentreToBaseOfText * Math.Cos(currentCharacterRadians));

                using (GraphicsPath characterPath = new GraphicsPath())
                {
                    characterPath.AddString(@char.ToString(), font.FontFamily, (int)font.Style, font.Size, Point.Empty,
                                            StringFormat.GenericTypographic);

                    var pathBounds = characterPath.GetBounds();

                    // Transformation matrix to move the character to the correct location. 
                    // Note that all actions on the Matrix class are prepended, so we apply them in reverse.
                    var transform = new Matrix();

                    // Translate to the final position
                    transform.Translate(centre.X + x, centre.Y + y);

                    // Rotate the character
                    var rotationAngleDegrees = currentCharacterRadians * 180F / (float)Math.PI - 180F;
                    transform.Rotate(rotationAngleDegrees);

                    // Translate the character so the centre of its base is over the origin
                    transform.Translate(-pathBounds.Width / 2F, -characterHeight);

                    characterPath.Transform(transform);

                    // Draw the character
                    graphics.FillPath(brush, characterPath);
                }

                if (characterIndex != text.Length - 1)
                {
                    // Move "currentCharacterRadians" on to the next character
                    float padding = 5;
                    var distanceToNextChar = padding + ((characterWidths[characterIndex] + characterWidths[characterIndex + 1]) / 2F);
                    float charFractionOfCircumference = distanceToNextChar / circleCircumference;
                    currentCharacterRadians -= charFractionOfCircumference * (float)(2F * Math.PI);
                }
            }
        }

        private static IEnumerable<float> GetCharacterWidths(Graphics graphics, string text, Font font)
        {
            // The length of a space. Necessary because a space measured using StringFormat.GenericTypographic has no width.
            // We can't use StringFormat.GenericDefault for the characters themselves, as it adds unwanted spacing.
            var spaceLength = graphics.MeasureString(" ", font, Point.Empty, StringFormat.GenericDefault).Width;

            return text.Select(c => c == ' ' ? spaceLength : graphics.MeasureString(c.ToString(), font, Point.Empty, StringFormat.GenericTypographic).Width);
        }
        #endregion
    }


}
