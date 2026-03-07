require "language/node"

class Githate < Formula
  desc "A fast, privacy-first CLI tool to track who unfollowed you on GitHub."
  homepage "https://github.com/GithubAnant/githate"
  url "https://registry.npmjs.org/githate/-/githate-1.3.3.tgz"
  sha256 "542d93f93d41de49c932f88c92c0fb2f220b3d2dce34db664b4ad8e8981de926"
  license "ISC"

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    # Add a simple test to ensure the script exists
    system "#{bin}/githate", "--version"
  end
end
