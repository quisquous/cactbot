using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text.RegularExpressions;

namespace Cactbot
{
    class AssemblyResolver : IDisposable
    {
        static readonly Regex assemblyNameParser = new Regex(
            @"(?<name>.+?), Version=(?<version>.+?), Culture=(?<culture>.+?), PublicKeyToken=(?<pubkey>.+)",
            RegexOptions.Compiled);

        public List<string> Directories { get; set; }

        public AssemblyResolver(IEnumerable<string> directories)
        {
            this.Directories = new List<string>();
            if (directories != null)
            {
                this.Directories.AddRange(directories);
            }

            AppDomain.CurrentDomain.AssemblyResolve += CustomAssemblyResolve;
        }

        public AssemblyResolver()
            : this(null)
        {

        }

        public void Dispose()
        {
            AppDomain.CurrentDomain.AssemblyResolve -= CustomAssemblyResolve;
        }

        private Assembly CustomAssemblyResolve(object sender, ResolveEventArgs e)
        {
            var match = assemblyNameParser.Match(e.Name);

            // Directories プロパティで指定されたディレクトリを基準にアセンブリを検索する
            foreach (var directory in this.Directories)
            {
                var asmPath = "";

                if (match.Success)
                {
                    var asmFileName = match.Groups["name"].Value + ".dll";
                    if (match.Groups["culture"].Value == "neutral")
                    {
                        asmPath = Path.Combine(directory, asmFileName);
                    }
                    else
                    {
                        asmPath = Path.Combine(directory, match.Groups["culture"].Value, asmFileName);
                    }
                }
                else
                {
                    asmPath = Path.Combine(directory, e.Name + ".dll");
                }

                if (File.Exists(asmPath))
                {
                    Assembly asm;
#if !DEBUG
                    if (e.Name.Contains("CefSharp"))
                    {
#endif
                        asm = Assembly.LoadFile(asmPath);
#if !DEBUG
                    } else
                    {
                        asm = Assembly.Load(File.ReadAllBytes(asmPath));
                    }
#endif
                    OnAssemblyLoaded(asm);
                    return asm;
                }
            }

            return null;
        }

        protected void OnExceptionOccured(Exception exception)
        {
            if (this.ExceptionOccured != null)
            {
                this.ExceptionOccured(this, new ExceptionOccuredEventArgs(exception));
            }
        }

        protected void OnAssemblyLoaded(Assembly assembly)
        {
            if (this.AssemblyLoaded != null)
            {
                this.AssemblyLoaded(this, new AssemblyLoadEventArgs(assembly));
            }
        }

        public event EventHandler<ExceptionOccuredEventArgs> ExceptionOccured;
        public event EventHandler<AssemblyLoadEventArgs> AssemblyLoaded;

        public class ExceptionOccuredEventArgs : EventArgs
        {
            public Exception Exception {get; set;}
            public ExceptionOccuredEventArgs(Exception exception)
            {
                this.Exception = exception;
            }
        }
    }
}
